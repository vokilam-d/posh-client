import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ConnectionService } from '../../services/connection.service';
import { MatTooltip } from '@angular/material/tooltip';
import { AsyncPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLinkActive,
    RouterLink,
    MatTooltip,
    AsyncPipe,
    MatIcon,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  readonly connectionService = inject(ConnectionService);

  readonly navbarItems: { route: string; iconName: string; tooltip: string }[] = [
    { route: 'pos', iconName: 'home', tooltip: 'Термінал' },
    { route: 'category', iconName: 'table_chart', tooltip: 'Категорії' },
    { route: 'product', iconName: 'coffee', tooltip: 'Товари' },
    { route: 'ingredient', iconName: 'grocery', tooltip: 'Інгредієнти' },
    { route: 'order', iconName: 'order_approve', tooltip: 'Замовлення' },
    { route: 'reports', iconName: 'chart_data', tooltip: 'Статистика' },
  ];

}
