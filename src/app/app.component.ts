import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  navbarItems: { route: string; iconName: string }[] = [
    { route: 'pos', iconName: 'home' },
    { route: 'category', iconName: 'table_chart' },
    { route: 'product', iconName: 'coffee' },
    { route: 'product-option', iconName: 'tune' },
  ];

  constructor() {
  }
}
