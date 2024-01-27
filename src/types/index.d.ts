import { NextPage } from 'next';
import { OrderItem } from './order';
import { ProductProps } from './product';
export interface IError {
  message: string;
  error: string;
  status: boolean;
  errors: [{
    [x: string]: string;
  }];
}

interface ContactSupportProps {
  name: string;
  email: string;
  business_type?: string;
  subject: string;
  message: string;
}

export interface ProductListingProps {
  title?: string;
  viewAllLink?: string;
  data?: Partial<ProductProps>[];
  collapse?: boolean;
  productState?: "published" | "draft";
  fromNewArrival?: boolean,
  owner?: boolean;
}

export interface ProductCardProps {
  item: Partial<ProductProps>;
  overflow?: boolean;
  productState?: "published" | "draft";
  owner?: boolean
  className?: string
}

export interface OrderCardProps {
  data: OrderItem;
  orderDetail?: boolean;
  seller?: boolean;
}

export interface NewOrders {
  name: string;
  product: string;
  price: number;
  orderDate: string;
}

export interface NewOrdersProps {
  data: OrderItem[];
}

export interface Transactions {
  name: string;
  type: string;
  dateTime: string;
  amount: number;
  BankInfo: string;
  status: string;
}
export interface TransactionHistoryProps {
  data: Transactions[];
}

export type NextPageWithLayout = NextPage & {
  requireAuth?: boolean;
};
