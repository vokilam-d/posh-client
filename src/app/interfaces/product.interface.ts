export interface IProductOptionValues {
  id: string;
  name: string;
  priceDiff: number;
}

export interface IProductOption {
  id: string;
  name: string;
  values: IProductOptionValues[];
}

