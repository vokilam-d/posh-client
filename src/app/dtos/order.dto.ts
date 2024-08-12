import { CreateOrUpdateOrderDto } from './create-or-update-order.dto';
import { OrderItemDto } from './order-item.dto';

export class OrderDto extends CreateOrUpdateOrderDto {
  id: number;
  totalPrimeCost: number;
  totalPrice: number;
  totalProfit: number;
  override orderItems: OrderItemDto[];
}
