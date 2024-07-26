import { Component, DestroyRef, ElementRef, inject, input, OnInit, output, signal, viewChild } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { INPUT_MEDIA_ACCEPT_TYPES } from '../../constants';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { getHttpErrorMessage } from '../../utils/get-http-error-message.util';
import { PreloaderComponent } from '../page-preloader/preloader.component';
import { UploadedPhotoResponseDto } from '../../dtos/uploaded-photo-response.dto';

@Component({
  standalone: true,
  selector: 'app-photo-uploader',
  templateUrl: './photo-uploader.component.html',
  imports: [
    PreloaderComponent,
  ],
  styleUrls: ['./photo-uploader.component.scss'],
})
export class PhotoUploaderComponent implements OnInit {

  private readonly httpClient = inject(HttpClient);
  private readonly toastr = inject(ToastrService);
  private readonly destroyRef = inject(DestroyRef);

  isLoading = signal<boolean>(false);
  readonly acceptTypes: string = INPUT_MEDIA_ACCEPT_TYPES;

  uploadUrl = input<string>();
  uploaded = output<string>();
  inputRef = viewChild<ElementRef<HTMLInputElement>>('input');

  ngOnInit() {
    if (!this.uploadUrl()) {
      this.toastr.error(`[${PhotoUploaderComponent.name}]: Input property 'uploadUrl' is mandatory`);
      throw new Error(`Input property 'uploadUrl' is mandatory`);
    }
  }

  onInputChange(files: FileList) {
    const file = files.item(0);

    this.uploadFile(file);
  }

  private uploadFile(file: File) {
    const payload = new FormData();
    payload.append('file', file, file.name);

    this.isLoading.set(true);
    this.httpClient.post<UploadedPhotoResponseDto>(this.uploadUrl(), payload)
      .pipe(
        finalize(() => {
          this.inputRef().nativeElement.value = '';
          this.isLoading.set(false);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: response => this.uploaded.emit(response.photoUrl),
        error: error => this.toastr.error(getHttpErrorMessage(error), `Не вдалося завантажити фото`),
      });
  }
}
