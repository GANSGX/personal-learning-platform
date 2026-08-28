import type { ProgressRepository } from "@plp/domain";
import { progressSchema } from "@plp/domain";

type ProgressStorageAdapter = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
};

export class LocalProgressRepository implements ProgressRepository {
  constructor(
    private readonly storage: ProgressStorageAdapter,
    private readonly keyPrefix = "plp-progress",
  ) {}

  private storageKey(userId: string): string {
    return `${this.keyPrefix}:${userId}`;
  }

  async getProgress(userId: string): Promise<ReturnType<typeof progressSchema.parse>> {
    const raw = await this.storage.getItem(this.storageKey(userId));

    if (raw === null) {
      return progressSchema.parse({ userId, nodes: {} });
    }

    const parsed: unknown = JSON.parse(raw);
    const progress = progressSchema.parse(parsed);

    if (progress.userId !== userId) {
      return progressSchema.parse({ userId, nodes: progress.nodes });
    }

    return progress;
  }

  async saveProgress(progress: ReturnType<typeof progressSchema.parse>): Promise<void> {
    const validated = progressSchema.parse(progress);
    await this.storage.setItem(this.storageKey(validated.userId), JSON.stringify(validated));
  }
}

export function createMemoryProgressStorage(
  initial = new Map<string, string>(),
): ProgressStorageAdapter {
  const store = initial;

  return {
    getItem(key: string) {
      return Promise.resolve(store.get(key) ?? null);
    },
    setItem(key: string, value: string) {
      store.set(key, value);
      return Promise.resolve();
    },
  };
}

const indexedDbPromiseCache = new Map<string, Promise<IDBDatabase>>();

function openIndexedDb(dbName: string, storeName: string): Promise<IDBDatabase> {
  const cacheKey = `${dbName}:${storeName}`;
  const cached = indexedDbPromiseCache.get(cacheKey);

  if (cached !== undefined) {
    return cached;
  }

  const promise = new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);

    request.addEventListener("upgradeneeded", () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(storeName)) {
        database.createObjectStore(storeName);
      }
    });

    request.addEventListener("success", () => {
      resolve(request.result);
    });

    request.addEventListener("error", () => {
      reject(request.error ?? new Error("Failed to open IndexedDB"));
    });
  });

  indexedDbPromiseCache.set(cacheKey, promise);
  return promise;
}

function readStoreValue(store: IDBObjectStore, key: string): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const request = store.get(key);

    request.addEventListener("success", () => {
      const value: unknown = request.result;
      resolve(typeof value === "string" ? value : null);
    });

    request.addEventListener("error", () => {
      reject(request.error ?? new Error("Failed to read progress"));
    });
  });
}

function writeStoreValue(store: IDBObjectStore, key: string, value: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = store.put(value, key);

    request.addEventListener("success", () => {
      resolve();
    });

    request.addEventListener("error", () => {
      reject(request.error ?? new Error("Failed to save progress"));
    });
  });
}

export function createIndexedDbProgressStorage(
  dbName: string,
  storeName: string,
): ProgressStorageAdapter {
  return {
    async getItem(key: string) {
      const db = await openIndexedDb(dbName, storeName);
      const transaction = db.transaction(storeName, "readonly");
      const store = transaction.objectStore(storeName);
      return readStoreValue(store, key);
    },
    async setItem(key: string, value: string) {
      const db = await openIndexedDb(dbName, storeName);
      const transaction = db.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      await writeStoreValue(store, key, value);
    },
  };
}
