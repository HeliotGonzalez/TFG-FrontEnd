import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Palabra } from '../models/palabra';
import { WordListComponent } from '../word-list/word-list.component';

@Component({
  selector: 'app-words-required',
  imports: [WordListComponent],
  templateUrl: './words-required.component.html',
  styleUrl: './words-required.component.css'
})
export class WordsRequiredComponent implements OnInit, AfterViewInit {

  words: Palabra[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getRequiredWords().subscribe({
      next: (response: any) => {
        this.words = response.map((word: any) => {
          console.log(response);
          return word;
        });
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  ngAfterViewInit(): void {
      scrollTo(0,0);
  }
}
