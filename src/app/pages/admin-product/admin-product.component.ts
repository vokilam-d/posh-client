import { Component, computed, inject, signal } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { PageContentComponent } from '../../components/page-content/page-content.component';
import { ProductDto } from '../../dtos/product.dto';
import { CreateOrUpdateProductDto } from '../../dtos/create-or-update-product.dto';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { getHttpErrorMessage } from '../../utils/get-http-error-message.util';
import { finalize } from 'rxjs';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { PagePreloaderComponent } from '../../components/page-preloader/page-preloader.component';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SelectedProductOptionDto } from '../../dtos/selected-product-option.dto';
import { MatOption, MatSelect } from '@angular/material/select';
import { ProductOptionService } from '../../services/product-option.service';
import { CategoryService } from '../../services/category.service';
import { ProductOptionValueDto } from '../../dtos/product-option-value.dto';
import { MatCheckbox } from '@angular/material/checkbox';
import { ProductOptionDto } from '../../dtos/product-option.dto';

interface SelectedProductOptionForm {
  optionId: FormControl<string>;
  optionValueId: FormControl<string>;
  isPriceDiffOverridden: FormControl<boolean>;
  priceDiff: FormControl<number>;
}

interface ProductForm {
  id: FormControl<string>;
  name: FormControl<string>;
  categoryId: FormControl<string>;
  price: FormControl<number>;
  photoUrl: FormControl<string>;
  sortOrder: FormControl<number>;
  options: FormArray<FormGroup<SelectedProductOptionForm>>;
}

@Component({
  selector: 'app-admin-product',
  standalone: true,
  imports: [
    PageContentComponent,
    MatProgressSpinner,
    ReactiveFormsModule,
    PagePreloaderComponent,
    MatFormFieldModule,
    MatInputModule,
    MatSelect,
    MatOption,
    MatCheckbox,
  ],
  templateUrl: './admin-product.component.html',
  styleUrl: './admin-product.component.scss'
})
export class AdminProductComponent {
  readonly productService = inject(ProductService);
  readonly productOptionService = inject(ProductOptionService);
  readonly categoryService = inject(CategoryService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly toastr = inject(ToastrService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  productId = signal<string | null>(null);
  isNewProduct = computed<boolean>(() => this.productId() === 'add');

  form: FormGroup<ProductForm>;
  get optionsFormArray(): ProductForm['options'] { return this.form.controls.options; }
  product = signal<ProductDto | CreateOrUpdateProductDto>(null);
  isLoading = signal<boolean>(false);

  constructor() {
    this.route.params
      .pipe(takeUntilDestroyed())
      .subscribe(params => params['productId'] ? this.init(params['productId']) : null );
  }

  save() {
    const dto: CreateOrUpdateProductDto = {
      ...this.product(),
      ...this.form.getRawValue(),
    };

    const request = this.isNewProduct()
      ? this.productService.create(dto)
      : this.productService.update(this.productId(), dto);

    this.isLoading.set(true);
    request
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe(
        response => {
          if (this.isNewProduct()) {
            this.router.navigate(['..', response.id], { relativeTo: this.route });
          } else {
            this.product.set(response);
          }
          this.toastr.success(`Успішно збережено`);
        },
        error => this.toastr.error(getHttpErrorMessage(error), `Не вдалося зберегти товар`),
      );
  }

  private init(productId: string) {
    this.productId.set(productId);

    if (this.isNewProduct()) {
      this.product.set(new CreateOrUpdateProductDto());
      this.buildForm();
    } else {
      this.isLoading.set(true);
      this.productService.fetchProductById(this.productId())
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe(
          response => {
            this.product.set(response);
            this.buildForm();
          },
          error => this.toastr.error(getHttpErrorMessage(error), `Не вдалося отримати товар`),
        );
    }
  }

  private buildForm() {
    const optionsFormArray = this.formBuilder.array(
      this.product().options.map(option => this.formBuilder.group<SelectedProductOptionDto>(option)),
    );
    this.form = this.formBuilder.group<ProductForm>({
      id: this.formBuilder.control(this.product().name),
      name: this.formBuilder.control(this.product().name),
      categoryId: this.formBuilder.control(this.product().categoryId),
      price: this.formBuilder.control(this.product().price),
      photoUrl: this.formBuilder.control(this.product().photoUrl),
      sortOrder: this.formBuilder.control(this.product().sortOrder),
      options: optionsFormArray,
    });

    optionsFormArray.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.onOptionsFormArrayChange(optionsFormArray.getRawValue()));
  }

  deleteProduct() {
    if (
      this.isNewProduct()
      || !confirm(`Ви впевнені що хочете видалити товар "${this.product().name}"?`)
    ) {
      return;
    }

    this.isLoading.set(true);
    this.productService.deleteProduct(this.productId())
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe(
        () => {
          this.router.navigate(['..'], { relativeTo: this.route });
          this.toastr.success(`Успішно видалено`, undefined);
        },
        error => this.toastr.error(getHttpErrorMessage(error), `Не вдалося видалити товар`),
      );
  }

  addSelectedOption() {
    const isPriceDiffOverridden = false;

    this.optionsFormArray.push(
      this.formBuilder.group({
        optionId: this.formBuilder.control(null),
        optionValueId: this.formBuilder.control(null),
        isPriceDiffOverridden: this.formBuilder.control(isPriceDiffOverridden),
        priceDiff: this.formBuilder.control({ value: 0, disabled: !isPriceDiffOverridden }),
      }),
    );
  }

  deleteSelectedOption(index: number) {
    this.optionsFormArray.removeAt(index);
  }

  getProductOptionValues(optionId: string): ProductOptionValueDto[] {
    return this.productOptionService.getProductOption(optionId)?.values || [];
  }

  onOptionsFormArrayChange(options: SelectedProductOptionDto[]): void {
    options.forEach((option, index) => {
      const optionGroup = this.optionsFormArray.at(index);
      if (!option.optionId) {
        optionGroup.controls.optionValueId.setValue(null, { emitEvent: false });
      }
      if (option.isPriceDiffOverridden) {
        optionGroup.controls.priceDiff.enable({ emitEvent: false })
      } else {
        optionGroup.controls.priceDiff.disable({ emitEvent: false })

        const selectedOptionValue = this.productOptionService.getProductOptionValue(
          option.optionId,
          option.optionValueId,
        );
        optionGroup.controls.priceDiff.setValue(selectedOptionValue?.priceDiff || 0, { emitEvent: false });
      }
    });
  }

  getProductOptionsForDropdown(index: number): ProductOptionDto[] {
    const selectedOptionIds = this.optionsFormArray.controls.map(group => group.controls.optionId.getRawValue());

    return this.productOptionService.cachedProductOptions().filter(option => {
      const selectedOptionIdIndex = selectedOptionIds.indexOf(option.id);
      return selectedOptionIdIndex === index || !selectedOptionIds.includes(option.id);
    });
  }
}
