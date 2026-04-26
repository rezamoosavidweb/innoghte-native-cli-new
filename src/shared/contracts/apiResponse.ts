/**
 * Generic API envelope (legacy shapes used across public list endpoints).
 */
export interface ResponseType<T> {
  data: T;
  status: number;
  message: string;
}
