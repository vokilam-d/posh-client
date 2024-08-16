import { Unit } from '../enums/unit.enum';

export class CreateOrUpdateIngredientDto {
  isEnabled: boolean = true;
  name: string = '';
  unit: Unit = Unit.Pcs;
  price: number = 0;
  qty: number = 0;
}
