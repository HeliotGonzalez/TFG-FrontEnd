import { Component, Input } from '@angular/core';
import { Palabra } from '../models/palabra';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-word-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './word-list.component.html',
  styleUrl: './word-list.component.css'
})
export class WordListComponent {
  @Input() words: Palabra[] = [];
  NPalabras: number = -1;
  wordLimit: number = 5;

  loadMore(): void {
    this.wordLimit += 5;
  }

}
