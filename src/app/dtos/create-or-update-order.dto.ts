import { PaymentType } from '../enums/payment-type.enum';
import { OrderItemDto } from './order-item.dto';

export class CreateOrUpdateOrderDto {
  orderItems: OrderItemDto[];
  paymentType: PaymentType;
}
