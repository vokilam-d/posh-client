import { Component, input } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-preloader',
  standalone: true,
  imports: [
    MatProgressSpinner,
  ],
  templateUrl: './preloader.component.html',
  styleUrl: './preloader.component.scss'
})
export class PreloaderComponent {
  isFixed = input<boolean>(true);
}
