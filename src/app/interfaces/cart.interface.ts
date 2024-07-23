import { PaymentType } from '../enums/payment-type.enum';
import { ICartItem } from './cart-item.interface';

export interface ICart {
  paymentType: PaymentType;
  items: ICartItem[];
  createdAtIso: string;
}
