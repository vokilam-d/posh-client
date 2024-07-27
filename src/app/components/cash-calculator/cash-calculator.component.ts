import { Component, inject, output, signal } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { MatDialogRef } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

enum NumpadButton {
  Dot = 'DOT',
  Remove = 'REMOVE',
}

@Component({
  selector: 'app-cash-calculator',
  standalone: true,
  imports: [],
  templateUrl: './cash-calculator.component.html',
  styleUrl: './cash-calculator.component.scss'
})
export class CashCalculatorComponent {
  readonly cartService = inject(CartService);
  readonly dialogRef = inject(MatDialogRef<CashCalculatorComponent>);

  numpadButtonEnum = NumpadButton;
  numpadRows = [
    [7, 8, 9],
    [4, 5, 6],
    [1, 2, 3],
    [NumpadButton.Dot, 0, NumpadButton.Remove],
  ];
  cashAmount: string = '0';

  private denominations = [10, 20, 50, 100, 200, 500, 1000];
  suggestions: number[] = [];

  isLoading = signal<boolean>(false);
  buy$ = output<void>();

  constructor() {
    this.suggestions = this.buildSuggestions();
  }

  isCustomNumpadButton(numpadBtn: unknown): boolean {
    return typeof numpadBtn !== 'number';
  }

  calcChange(): number {
    const cash = parseFloat(this.cashAmount);
    return cash - this.cartService.totalCost();
  }

  onSuggestionClick(suggestion: number): void {
    this.cashAmount = `${suggestion}`;
  }

  onNumpadClick(numpadButton: unknown): void {
    const isZero = this.cashAmount === '0';

    switch (numpadButton) {
      case NumpadButton.Remove:
        if (!isZero) {
          this.cashAmount = this.cashAmount.slice(0, this.cashAmount.length - 1);
        }

        if (this.cashAmount.length === 0) {
          this.cashAmount = '0';
        }
        break;
      case NumpadButton.Dot:
        const dotSign = `,`;
        if (isZero || !this.cashAmount.endsWith(dotSign)) {
          this.cashAmount += dotSign;
        }
        break;
      default:
        if (isZero) {
          this.cashAmount = `${numpadButton}`;
        } else {
          this.cashAmount += numpadButton;
        }
        break;
    }
  }

  onBuy(): void {
    this.isLoading.set(true);
    this.buy$.emit();
  }

  private buildSuggestions(): number[] {
    const totalCost = this.cartService.totalCost();

    const lowerDenominations: number[] = [];
    const higherDenominations: number[] = [];
    this.denominations.forEach(denomination => {
      if (denomination >= totalCost) {
        higherDenominations.push(denomination);
      } else {
        lowerDenominations.push(denomination);
      }
    });

    if (!lowerDenominations.length) {
      return higherDenominations;
    }

    const suggestions: number[] = [];
    const highestOfLower = lowerDenominations.pop();
    const lowestOfLower = lowerDenominations[0];
    lowerDenominations.forEach(denomination => {
      let suggestion = highestOfLower + denomination;
      if (suggestion >= totalCost) {
        suggestions.push(suggestion);
      } else if (lowestOfLower) {
        while (suggestion < totalCost) {
          suggestion += lowestOfLower;
        }
        suggestions.push(suggestion);
      }
    });

    return [...new Set([...suggestions, ...higherDenominations])];
  }
}
