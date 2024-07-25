export class ReorderCategoryDto {
  id: string;
  newSortOrder: number;
}

export class ReorderCategoriesDto {
  categories: ReorderCategoryDto[]
}
