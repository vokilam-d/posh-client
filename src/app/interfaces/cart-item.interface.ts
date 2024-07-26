export interface ICartItemSelectedOption {
  optionId: string;
  optionName: string;
  optionValueId: string;
  optionValueName: string;
  priceDiff: number;
}

export interface ICartItem {
  productId: string;
  productName: string;
  qty: number;
  price: number;
  selectedOptions: ICartItemSelectedOption[];
}
