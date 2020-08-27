export function getAllSettledValues<T>(
  results: PromiseSettledResult<T>[],
  errorMessage: string
): T[] {
  const errorIndexes = [];
  const values = [];

  for (let i = 0; i < results.length; i += 1) {
    const result = results[i];
    if (result.status === "fulfilled") {
      values.push(result.value);
    } else {
      console.error(result.reason);
      errorIndexes.push(i);
    }
  }

  if (errorIndexes.length > 0) {
    throw new Error(`${errorMessage} at indexes [${errorIndexes.join(", ")}]`);
  }

  return values;
}
