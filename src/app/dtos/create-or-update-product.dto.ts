import { SelectedProductOptionDto } from './selected-product-option.dto';

export class CreateOrUpdateProductDto {
  name: string = '';
  price: number = 0;
  categoryId: string = null;
  photoUrl: string = null;
  options: SelectedProductOptionDto[] = [];
  sortOrder: number = 0;
}
