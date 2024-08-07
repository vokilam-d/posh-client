import { Component, computed, inject, signal } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { PageContentComponent } from '../../components/page-content/page-content.component';
import { CategoryDto } from '../../dtos/category.dto';
import { CreateOrUpdateCategoryDto } from '../../dtos/create-or-update-category.dto';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { getHttpErrorMessage } from '../../utils/get-http-error-message.util';
import { finalize } from 'rxjs';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { PreloaderComponent } from '../../components/page-preloader/preloader.component';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PhotoUploaderComponent } from '../../components/photo-uploader/photo-uploader.component';
import { environment } from '../../../environments/environment';
import { PhotoAssetComponent } from '../../components/photo-asset/photo-asset.component';

type CategoryForm = Record<keyof CreateOrUpdateCategoryDto, FormControl>;

@Component({
  selector: 'app-admin-category',
  standalone: true,
  imports: [
    PageContentComponent,
    MatProgressSpinner,
    ReactiveFormsModule,
    PreloaderComponent,
    PhotoUploaderComponent,
    PhotoAssetComponent,
  ],
  templateUrl: './admin-category.component.html',
  styleUrl: './admin-category.component.scss'
})
export class AdminCategoryComponent {
  categoryId = signal<string | null>(null);
  isNewCategory = computed<boolean>(() => this.categoryId() === 'add');

  form: FormGroup<CategoryForm>;
  category = signal<CategoryDto | CreateOrUpdateCategoryDto>(null);
  isLoading = signal<boolean>(false);

  readonly photoUploadUrl = `${environment.apiUrl}/categories/photo`;

  readonly categoryService = inject(CategoryService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly toastr = inject(ToastrService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  constructor() {
    this.route.params
      .pipe(takeUntilDestroyed())
      .subscribe(params => params['categoryId'] ? this.init(params['categoryId']) : null );
  }

  save() {
    const dto: CreateOrUpdateCategoryDto = {
      ...this.category(),
      ...this.form.getRawValue(),
    };

    const request = this.isNewCategory()
      ? this.categoryService.create(dto)
      : this.categoryService.update(this.categoryId(), dto);

    this.isLoading.set(true);
    request
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe(
        response => {
          if (this.isNewCategory()) {
            this.router.navigate(['..', response.id], { relativeTo: this.route });
          } else {
            this.category.set(response);
          }
          this.toastr.success(`Успішно збережено`);
        },
        error => this.toastr.error(getHttpErrorMessage(error), `Не вдалося зберегти категорію`),
      );
  }

  private init(categoryId: string) {
    this.categoryId.set(categoryId);

    if (this.isNewCategory()) {
      this.category.set(new CreateOrUpdateCategoryDto());
      this.buildForm();
    } else {
      this.isLoading.set(true);
      this.categoryService.fetchCategoryById(this.categoryId())
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe(
          response => {
            this.category.set(response);
            this.buildForm();
          },
          error => this.toastr.error(getHttpErrorMessage(error), `Не вдалося отримати категорію`),
        );
    }
  }

  private buildForm() {
    this.form = this.formBuilder.group<CreateOrUpdateCategoryDto>({
      name: this.category().name,
      photoUrl: this.category().photoUrl,
      sortOrder: this.category().sortOrder,
    });
  }

  deleteCategory() {
    if (
      this.isNewCategory()
      || !confirm(`Ви впевнені що хочете видалити категорію "${this.category().name}"?`)
    ) {
      return;
    }

    this.isLoading.set(true);
    this.categoryService.deleteCategory(this.categoryId())
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe(
        () => {
          this.router.navigate(['..'], { relativeTo: this.route });
          this.toastr.success(`Успішно видалено`, undefined);
        },
        error => this.toastr.error(getHttpErrorMessage(error), `Не вдалося видалити категорію`),
      );
  }

  onPhotoUpload(photoUrl: string): void {
    this.form.controls.photoUrl.setValue(photoUrl);
  }
}
