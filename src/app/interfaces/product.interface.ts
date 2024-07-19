export interface IProduct {
  id: string;
  categoryId: string | null;
  name: string;
  price: number;
  photoUrl?: string | null;
}
