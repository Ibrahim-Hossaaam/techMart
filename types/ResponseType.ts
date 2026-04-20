import { Metadata } from "../src/interfaces/Metadata";

export type ResponseType<T> = {
  results: number;
  metadata: Metadata;
  data: T[];
};