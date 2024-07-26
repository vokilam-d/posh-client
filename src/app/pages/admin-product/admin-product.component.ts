import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { PageContentComponent } from '../../components/page-content/page-content.component';
import { ProductDto } from '../../dtos/product.dto';
import { CreateOrUpdateProductDto } from '../../dtos/create-or-update-product.dto';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { getHttpErrorMessage } from '../../utils/get-http-error-message.util';
import { finalize, startWith } from 'rxjs';
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
import { MatCheckbox } from '@angular/material/checkbox';
import { ProductOptionDto } from '../../dtos/product-option.dto';

interface OptionValueForm {
  isEnabled: FormControl<boolean>;
  id: FormControl<string>;
  name: FormControl<string>;
  isPriceDiffOverridden: FormControl<boolean>;
  priceDiff: FormControl<number>;
}

interface OptionForm {
  optionId: FormControl<string>;
  optionValues: FormArray<FormGroup<OptionValueForm>>
}

interface ProductForm {
  name: FormControl<string>;
  categoryId: FormControl<string>;
  price: FormControl<number>;
  photoUrl: FormControl<string>;
  sortOrder: FormControl<number>;
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
  private readonly destroyRef = inject(DestroyRef);

  productId = signal<string | null>(null);
  isNewProduct = computed<boolean>(() => this.productId() === 'add');
  product = signal<ProductDto | CreateOrUpdateProductDto>(null);
  isLoading = signal<boolean>(false);

  form: FormGroup<ProductForm>;
  optionsFormArray = this.formBuilder.array<FormGroup<OptionForm>>([]);

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
    dto.options = this.optionsFormArray.getRawValue().map(optionFormValue => {
      return {
        optionId: optionFormValue.optionId,
        optionValues: optionFormValue.optionValues
          .filter(optionValue => optionValue.isEnabled)
          .map(optionValue => {
            return {
              optionValueId: optionValue.id,
              isPriceDiffOverridden: optionValue.isPriceDiffOverridden,
              priceDiff: optionValue.priceDiff,
            };
          }),
      };
    });

    const request = this.isNewProduct()
      ? this.productService.create(dto)
      : this.productService.update(this.productId(), dto);

    this.isLoading.set(true);
    request
      .pipe(
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
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
        .pipe(
          finalize(() => this.isLoading.set(false)),
          takeUntilDestroyed(this.destroyRef),
        )
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
    this.form = this.formBuilder.group<ProductForm>({
      name: this.formBuilder.control(this.product().name),
      categoryId: this.formBuilder.control(this.product().categoryId),
      price: this.formBuilder.control(this.product().price),
      photoUrl: this.formBuilder.control(this.product().photoUrl),
      sortOrder: this.formBuilder.control(this.product().sortOrder),
    });

    this.optionsFormArray.clear();
    this.product().options.forEach(option => this.addSelectedOptionForm(option));
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
      .pipe(
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(
        () => {
          this.router.navigate(['..'], { relativeTo: this.route });
          this.toastr.success(`Успішно видалено`, undefined);
        },
        error => this.toastr.error(getHttpErrorMessage(error), `Не вдалося видалити товар`),
      );
  }

  getProductOptionsForDropdown(index: number): ProductOptionDto[] {
    const selectedOptionIds = this.optionsFormArray.controls.map(group => group.controls.optionId.getRawValue());

    return this.productOptionService.cachedProductOptions().filter(option => {
      const selectedOptionIdIndex = selectedOptionIds.indexOf(option.id);
      return selectedOptionIdIndex === index || !selectedOptionIds.includes(option.id);
    });
  }

  addSelectedOptionForm(selectedProductOption: SelectedProductOptionDto = new SelectedProductOptionDto()): void {
    const formGroup = this.formBuilder.group<OptionForm>({
      optionId: this.formBuilder.control(selectedProductOption.optionId),
      optionValues: this.formBuilder.array<FormGroup<OptionValueForm>>([]),
    });

    formGroup.controls.optionId.valueChanges
      .pipe(
        startWith(formGroup.controls.optionId.getRawValue()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(optionId => {
        formGroup.controls.optionValues.clear();

        const option = this.productOptionService.getProductOption(optionId);
        if (!option) {
          return;
        }

        option.values.forEach(optionValue => {
          const isSelected = selectedProductOption?.optionValues.find(selectedValue => {
            return selectedValue.optionValueId === optionValue.id;
          });

          const isEnabled = !!isSelected;
          const isPriceDiffOverridden = isSelected?.isPriceDiffOverridden ?? false;
          const priceDiff = isSelected?.priceDiff ?? optionValue.priceDiff;

          const optionValueGroup = this.formBuilder.group<OptionValueForm>({
            isEnabled: this.formBuilder.control(isEnabled),
            id: this.formBuilder.control(optionValue.id),
            name: this.formBuilder.control({ value: optionValue.name, disabled: true }),
            isPriceDiffOverridden: this.formBuilder.control(isPriceDiffOverridden),
            priceDiff: this.formBuilder.control(priceDiff),
          });

          optionValueGroup.controls.isEnabled.valueChanges
            .pipe(
              startWith(optionValueGroup.controls.isEnabled.getRawValue()),
              takeUntilDestroyed(this.destroyRef),
            )
            .subscribe(isEnabled => {
              if (isEnabled) {
                optionValueGroup.controls.isPriceDiffOverridden.enable();
              } else {
                optionValueGroup.controls.isPriceDiffOverridden.disable();
              }
            });

          formGroup.controls.optionValues.push(optionValueGroup);
          optionValueGroup.controls.isPriceDiffOverridden.valueChanges
            .pipe(
              startWith(optionValueGroup.controls.isPriceDiffOverridden.getRawValue()),
              takeUntilDestroyed(this.destroyRef),
            )
            .subscribe(isOverridden => {
              if (isOverridden) {
                optionValueGroup.controls.priceDiff.enable();
              } else {
                optionValueGroup.controls.priceDiff.disable();
                optionValueGroup.controls.priceDiff.setValue(optionValue.priceDiff);
              }
            });
        });
      });

    this.optionsFormArray.push(formGroup);
  }

  deleteSelectedOption(index: number) {
    this.optionsFormArray.removeAt(index);
  }
}
