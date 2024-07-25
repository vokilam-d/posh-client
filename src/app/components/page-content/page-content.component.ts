import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-page-content',
  standalone: true,
  imports: [
    RouterLink,
  ],
  templateUrl: './page-content.component.html',
  styleUrl: './page-content.component.scss'
})
export class PageContentComponent {

  backUrl = input<string>(null);
}
