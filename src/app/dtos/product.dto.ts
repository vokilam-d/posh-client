import { CreateOrUpdateProductDto } from './create-or-update-product.dto';

export class ProductDto extends CreateOrUpdateProductDto {
  id: string = null;
}