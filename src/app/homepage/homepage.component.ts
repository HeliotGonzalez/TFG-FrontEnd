// homepage.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { SearchingBarComponent } from '../searching-bar/searching-bar.component';
import { AuthService } from '../services/auth-service.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
  imports: [CommonModule, SearchingBarComponent, RouterModule]
})
export class HomepageComponent { 
  isAdmin: boolean = false;
  constructor(private router: Router, private authService: AuthService) {
  this.authService.currentUser$.subscribe(user => {
    this.isAdmin = !!user && user.role_id === 4;
  });
  }

  onSearchResults(words: any[]): void {
    this.router.navigate(['/words-by-search'], { state: { words } });
  }
}
