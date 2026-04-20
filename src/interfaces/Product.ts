import { Category } from "./Category";
import { ISubcategory } from "./Subcategory";
import { Brand } from "./Brand";
export interface Product {
  sold: number;
  images: string[];
  subcategory: ISubcategory[];
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