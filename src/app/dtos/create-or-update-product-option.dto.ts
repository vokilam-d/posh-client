import { ProductOptionValueDto } from './product-option-value.dto';

export class CreateOrUpdateProductOptionDto {
  name: string = '';
  values: ProductOptionValueDto[] = [];
}
