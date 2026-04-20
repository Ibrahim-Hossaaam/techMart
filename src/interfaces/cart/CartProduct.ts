import { Brand } from "../Brand";
import { Category } from "../Category";
import { Subcategory } from "../Subcategory"; 

export interface CartProduct { 
    count: number;
     _id: string;
      product: Product; 
      price: number;
     }




interface Product {
  _id: string;
  id: string;
  title: string;
  slug: string;
  quantity: number;
  imageCover: string;
  category: Category;
  brand: Brand;
  subcategory: Subcategory[];
  ratingsAverage: number;
}



