export async function parseJsonResponse<T>(request: Promise<Response>): Promise<T> {
  const response = await request;
  return (await response.json()) as T;
}
