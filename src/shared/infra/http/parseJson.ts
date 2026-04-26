import { type z } from 'zod';

/**
 * Await a Ky `ResponsePromise`, parse JSON, and optionally validate with Zod.
 * Call sites that omit `schema` still perform a blind cast (legacy).
 */
export async function parseJsonResponse<T>(
  request: Promise<Response>,
  schema: z.ZodType<T>,
): Promise<T>;
export async function parseJsonResponse<T>(request: Promise<Response>): Promise<T>;
export async function parseJsonResponse<T>(
  request: Promise<Response>,
  schema?: z.ZodType<T>,
): Promise<T> {
  const response = await request;
  const json: unknown = await response.json();
  if (schema) {
    return schema.parse(json);
  }
  return json as T;
}
