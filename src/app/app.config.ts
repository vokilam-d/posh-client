import {
  ApplicationConfig,
  importProvidersFrom,
  isDevMode,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { MatDialogModule } from '@angular/material/dialog';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { provideHttpClient } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { provideServiceWorker } from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(
      routes,
      withComponentInputBinding(),
    ),
    importProvidersFrom(MatDialogModule),
    importProvidersFrom(DragDropModule),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideToastr({ positionClass: 'toast-bottom-center' }),
    provideServiceWorker('ngsw-worker.js', { enabled: !isDevMode(), registrationStrategy: 'registerWhenStable:30000' }),
  ],
};
