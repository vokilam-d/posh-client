export class ReorderProductDto {
  id: string;
  newSortOrder: number;
}

export class ReorderProductsDto {
  products: ReorderProductDto[];
}
