import { CreateOrUpdateOrderDto } from './create-or-update-order.dto';

export class OrderDto extends CreateOrUpdateOrderDto {
  id: string;
  totalCost: number;
}
