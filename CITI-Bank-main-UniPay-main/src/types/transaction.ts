
export interface Transaction {
  id: string;
  date: string;
  description: string;
  merchant: string;
  amount: number;
  category: string;
  status: string;
}