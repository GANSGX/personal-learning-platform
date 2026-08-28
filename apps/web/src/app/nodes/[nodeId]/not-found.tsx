import Link from "next/link";

export default function LessonNotFound() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center px-6 py-16 text-center">
      <h1 className="text-foreground text-2xl font-medium">Lesson not found</h1>
      <p className="text-muted-foreground mt-2 max-w-md text-sm">
        There is no MDX lesson for this knowledge node id.
      </p>
      <Link href="/" className="text-primary mt-6 text-sm underline-offset-4 hover:underline">
        Back to knowledge map
      </Link>
    </div>
  );
}
