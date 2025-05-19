import { Component, OnInit, OnDestroy } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { CommonModule } from '@angular/common'; 
import { HeaderVisibilityService } from './services/header-visibility.service';
import { RouterOutlet, RouterModule, Router, NavigationStart, NavigationEnd, NavigationCancel,NavigationError } from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { NotificationsComponent } from './notifications/notifications.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true, 
  imports: [
    HeaderComponent,
    CommonModule,
    RouterOutlet,
    RouterModule,
    LoadingBarModule,
    LoadingBarRouterModule,
    LoadingBarHttpClientModule, 
    NotificationsComponent
  ],
})
export class AppComponent implements OnInit, OnDestroy {
  showHeader = true;
  private progressInterval: any;

  constructor(
    private headerService: HeaderVisibilityService,
    private router: Router,
    private loadingBar: LoadingBarService,
  ) {}

  ngOnInit(): void {
    this.headerService.showHeader$.subscribe(show => {
      setTimeout(() => {
        this.showHeader = show;
      });
    });

    // TODO: Cambiar funciones deprecated
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        // Inicia la barra de carga
        this.loadingBar.start();

        // Incrementa progresivamente cada 100ms (ajusta el valor según necesites)
        this.progressInterval = setInterval(() => {
          this.loadingBar.increment(3);
        }, 100);
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        // Detiene el incremento y completa la barra
        if (this.progressInterval) {
          clearInterval(this.progressInterval);
        }
        this.loadingBar.complete();
      }
    });
  
  }

  ngOnDestroy(): void {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
  }
}