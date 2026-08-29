type SearchParamReader = {
  get(name: string): string | null;
};

export function oauthErrorFromSearchParams(params: SearchParamReader): string | null {
  const description = params.get("error_description")?.trim();

  if (description !== undefined && description.length > 0) {
    return description;
  }

  const error = params.get("error")?.trim();

  if (error !== undefined && error.length > 0) {
    return error;
  }

  return null;
}
