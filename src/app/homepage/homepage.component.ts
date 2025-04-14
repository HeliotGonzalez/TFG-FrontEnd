// homepage.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { SearchingBarComponent } from '../searching-bar/searching-bar.component';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
  standalone: true, 
  imports: [CommonModule, SearchingBarComponent, RouterModule]
})
export class HomepageComponent { 
  constructor(private router: Router) {}

  onSearchResults(words: any[]): void {
    // Redirigimos al componente 'words-by-search' con state
    this.router.navigate(['/words-by-search'], { state: { words } });
  }
}
