import { PaymentType } from '../enums/payment-type.enum';
import { OrderItemDto } from '../dtos/order-item.dto';

export interface ICart {
  paymentType: PaymentType;
  items: OrderItemDto[];
  createdAtIso: string;
}
