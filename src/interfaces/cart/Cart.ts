import { CartProduct } from "./CartProduct";
export interface Cart {
  _id: string;
  cartOwner: string;
  products:     CartProduct[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  totalCartPrice: number;
}