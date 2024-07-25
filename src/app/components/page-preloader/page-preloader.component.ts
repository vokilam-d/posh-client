import { Component } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-page-preloader',
  standalone: true,
  imports: [
    MatProgressSpinner,
  ],
  templateUrl: './page-preloader.component.html',
  styleUrl: './page-preloader.component.scss'
})
export class PagePreloaderComponent {

}
