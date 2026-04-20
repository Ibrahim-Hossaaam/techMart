import { IMetadata } from "../src/interfaces/Metadata";

export type ResponseType<T> = {
  results: number;
  metadata: IMetadata;
  data: T[];
};