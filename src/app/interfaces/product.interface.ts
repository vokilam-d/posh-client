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

export interface IProduct {
  id: string;
  categoryId: string | null;
  name: string;
  price: number;
  photoUrl?: string | null;
  options: IProductOption[];
}
