export type TicketUploadFile = {
  uri: string;
  name: string;
  mimeType: string;
  size: number;
};

export type CreateTicketFields = {
  title: string;
  category: string;
  priority: string;
  description: string;
  attachments: TicketUploadFile[];
};
