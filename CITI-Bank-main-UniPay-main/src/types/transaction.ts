
export interface Transaction {
  id: string;
  date: string;
  description: string;
  merchant: string;
  amount: number;
  category: string;
  status: string;
  time: string;
  type: string;
  reference?: string;
  paymentMethod?: string;
  notes?: string;
  tags?: string[];
  location: string;
  scheduledDate?: string; // For scheduled transactions
}