import { Admin } from './admin.interface';

export interface Invoice {
  _id?: string;
  invoiceId?: string;
  customerId?: string;
  name: string;
  address?: string;
  phoneNo?: string;
  email?: string;
  paymentStatus?: string;
  status?: string;
  dateString?: string;
  date?: Date;
  month?: number;
  generatedBy?: Admin;
  project?: any;
  items: InvoiceItem[];
  amount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface InvoiceItem {
  _id?: string;
  name: string;
  quantity: number;
  price: number;
  discountAmount?: number;
  discountType?: number;
}
