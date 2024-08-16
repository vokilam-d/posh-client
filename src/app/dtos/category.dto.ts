import { CreateOrUpdateCategoryDto } from './create-or-update-category.dto';

export class CategoryDto extends CreateOrUpdateCategoryDto {
  id: string = null;
  createdAtIso: string;
  updatedAtIso: string;
}
