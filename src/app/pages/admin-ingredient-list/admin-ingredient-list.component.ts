import { Component, inject, OnInit, signal } from '@angular/core';
import { IngredientService } from '../../services/ingredient.service';
import { RouterLink } from '@angular/router';
import { PageContentComponent } from '../../components/page-content/page-content.component';
import { PreloaderComponent } from '../../components/page-preloader/preloader.component';
import { finalize } from 'rxjs';
import { IngredientDto } from '../../dtos/ingredient.dto';
import { getHttpErrorMessage } from '../../utils/get-http-error-message.util';
import { ToastrService } from 'ngx-toastr';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { IngredientUnitPipe } from '../../pipes/ingredient-unit.pipe';
import { MatAnchor } from '@angular/material/button';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin-ingredient-list',
  standalone: true,
  imports: [
    RouterLink,
    PageContentComponent,
    PreloaderComponent,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCellDef,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    MatNoDataRow,
    IngredientUnitPipe,
    MatAnchor,
    DatePipe,
  ],
  templateUrl: './admin-ingredient-list.component.html',
  styleUrl: './admin-ingredient-list.component.scss'
})
export class AdminIngredientListComponent implements OnInit {

  private readonly IngredientService = inject(IngredientService);
  private readonly toastr = inject(ToastrService);

  isLoading = signal<boolean>(false);
  ingredients = signal<IngredientDto[]>([]);
  displayedColumns: (keyof IngredientDto)[] = ['name', 'price', 'qty', 'isEnabled', 'createdAtIso', 'updatedAtIso'];

  ngOnInit() {
    this.fetchIngredients();
  }

  /**
   * Workaround for type-checking, see: https://stackoverflow.com/a/61682343/7499769
   */
  i(ingredient: IngredientDto) { return ingredient; }

  private fetchIngredients() {
    this.isLoading.set(true);

    this.IngredientService.fetchIngredients()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: response => this.ingredients.set(response),
        error: error => this.toastr.error(getHttpErrorMessage(error), `Не вдалося отримати інгредієнти`),
      });
  }
}
