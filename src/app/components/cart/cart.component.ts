import { Component, computed, inject } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { FormsModule } from '@angular/forms';
import { PaymentType } from '../../enums/payment-type.enum';
import { KeyValuePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CashCalculatorComponent } from '../cash-calculator/cash-calculator.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    FormsModule,
    KeyValuePipe,
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {

  cartService = inject(CartService);
  private dialog = inject(MatDialog);

  paymentTypeEnum = PaymentType;

  canOpenCashCalculator = computed<boolean>(() => {
    return this.cartService.cartItems().length && this.cartService.paymentType() === PaymentType.Cash;
  });
  canBuy = computed<boolean>(() => this.cartService.cartItems().length && !!this.cartService.paymentType());

  openCashCalculator() {
    this.dialog.open(CashCalculatorComponent);
  }
}
