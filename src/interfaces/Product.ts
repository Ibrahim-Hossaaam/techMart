import { Category } from "./Category";
import { Subcategory } from "./Subcategory";
import { Brand } from "./Brand";
export interface Product {
  sold: number;
  images: string[];
  subcategory: Subcategory[];
  ratingsQuantity: number;

  _id: string;
  id: string;
  title: string;
  slug: string;
  description: string;

  quantity: number;
  price: number;

  imageCover: string;

  category: Category;
  brand: Brand;

  ratingsAverage: number;

  createdAt: string;
  updatedAt: string;
}