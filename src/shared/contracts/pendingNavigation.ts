/** Serializable snapshot for post-login resume (route name + optional params). */
export type PendingNavigation = {
  name: string;
  params?: Record<string, unknown>;
};
