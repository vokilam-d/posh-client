import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ConnectionService } from '../../services/connection.service';
import { MatTooltip } from '@angular/material/tooltip';
import { AsyncPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { routes } from '../../app.routes';

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

  readonly navbarItems: { path: string; iconName: string; tooltip: string }[] = routes
    .filter(route => route.data?.['isInNavbar'])
    .map(route => ({ path: route.path, tooltip: route.title as string, iconName: route.data['iconName'] }));

}
