import { Metadata } from "./Metadata";
import { Product } from "./Product";
export interface ProductsResponse {
  results: number;
  metadata: Metadata;
  data: Product[];
}