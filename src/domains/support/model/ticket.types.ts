/** Normalized ticket row for UI — never pass raw API shapes to components. */
export type Ticket = {
  readonly id: number;
  readonly ticketNumber: string;
  readonly title: string;
  readonly status: string;
  /** Empty string when API omits category. */
  readonly category: string;
  readonly createdAt: string;
};

export type TicketThreadAuthorRole = 'user' | 'staff';

/** Normalized thread line on ticket detail. */
export type TicketThreadMessage = {
  readonly id: number;
  readonly body: string;
  readonly authorRole: TicketThreadAuthorRole;
  readonly createdAt: string;
};

export type TicketDetail = Ticket & {
  readonly description: string;
  readonly messages: readonly TicketThreadMessage[];
};
