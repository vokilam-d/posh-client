import { OrderItemSelectedOptionDto } from './order-item-selected-option.dto';


export class OrderItemDto {
  productId: string;
  productName?: string;
  photoUrl?: string;
  qty: number;
  price?: number;
  cost?: number;
  selectedOptions: OrderItemSelectedOptionDto[];
}
