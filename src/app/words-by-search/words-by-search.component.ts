// words-by-search.component.ts
import { AfterViewInit, Component } from '@angular/core';
import { SearchingBarComponent } from '../searching-bar/searching-bar.component';
import { WordListComponent } from '../word-list/word-list.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-words-by-search',
  imports: [SearchingBarComponent, WordListComponent],
  templateUrl: './words-by-search.component.html',
  styleUrls: ['./words-by-search.component.css']
})
export class WordsBySearchComponent implements AfterViewInit {
  words: any[] = [];

  ngAfterViewInit(): void {
    window.scrollTo(0, 0); 
  }

  constructor(private router: Router) {
    // Recogemos los datos que se enviaron desde homepage (si los hay)
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['words']) {
      this.words = navigation.extras.state['words'];
      console.log('Palabras recibidas:', this.words);
    }
  }



  // Si se realiza otra búsqueda desde esta vista,
  // se actualiza la propiedad words (sin hacer router.navigate)
  onSearchResults(newResults: any[]): void {
    this.words = newResults;
  }
}
