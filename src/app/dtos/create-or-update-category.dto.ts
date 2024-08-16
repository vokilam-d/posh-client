export class CreateOrUpdateCategoryDto {
  isEnabled: boolean = true;
  name: string = '';
  photoUrl: string = null;
  sortOrder: number = 0;
}
