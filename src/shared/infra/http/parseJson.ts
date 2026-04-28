import { type z } from 'zod';

/**
 * Await a Ky `ResponsePromise`, parse JSON, and validate with Zod.
 * Schema is required: every API call must declare its expected shape.
 */
export async function parseJsonResponse<T>(
  request: Promise<Response>,
  schema: z.ZodType<T>,
): Promise<T> {
  const response = await request;
  const json: unknown = await response.json();
  return schema.parse(json);
}
