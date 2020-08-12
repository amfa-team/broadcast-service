export function getAllSettledValues<T>(
  results: PromiseSettledResult<T>[],
  errorMessage: string
): T[] {
  let hasError = false;
  const values = [];

  for (let i = 0; i < results.length; i += 1) {
    const result = results[i];
    if (result.status === "fulfilled") {
      values.push(result.value);
    } else {
      console.error(result.reason);
      hasError = true;
    }
  }

  if (hasError) {
    throw new Error(errorMessage);
  }

  return values;
}
