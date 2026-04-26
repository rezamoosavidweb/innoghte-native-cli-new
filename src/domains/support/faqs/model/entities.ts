export type FaqType = {
  id: number;
  title: string;
  faqs: Array<{
    id: number;
    question: string;
    answer: string;
  }>;
};
