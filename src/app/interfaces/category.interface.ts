export interface ICategory {
  id: string;
  name: string;
  parentCategoryId: string | null;
  photoUrl?: string;
}
