import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { CommonModule } from '@angular/common'; 
import { ApiService } from './services/api.service';
import { HeaderVisibilityService } from './services/header-visibility.service';
import { RouterOutlet, RouterModule } from '@angular/router';

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
  ],
})
export class AppComponent{
  orders: any[] = [];
  showHeader = true;

  constructor(private apiService: ApiService, private headerService: HeaderVisibilityService) {}

  ngOnInit() {
    this.headerService.showHeader$.subscribe(show => {
      setTimeout(() => {
        this.showHeader = show;
      });
    });
  }
}
