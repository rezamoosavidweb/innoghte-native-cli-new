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

export type TicketAttachment = {
  readonly path: string;
  readonly originalName: string;
  readonly mimeType: string;
  readonly size: number;
};

/** Normalized thread line on ticket detail. */
export type TicketThreadMessage = {
  readonly id: number;
  readonly body: string;
  readonly authorRole: TicketThreadAuthorRole;
  readonly createdAt: string;
  readonly attachments: readonly TicketAttachment[];
};

export type TicketDetail = Ticket & {
  readonly description: string;
  readonly priority: string;
  readonly attachments: readonly TicketAttachment[];
  readonly messages: readonly TicketThreadMessage[];
};
