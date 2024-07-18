export interface IProduct {
  id: string;
  parentCategoryId: string | null;
  name: string;
  price: number | null;
  isCategory: boolean;
  photoUrl: string | null;
}
