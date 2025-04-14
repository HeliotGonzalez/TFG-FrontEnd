import { Component, Input, OnInit} from '@angular/core';
import { Palabra } from '../models/palabra';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-word-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './word-list.component.html',
  styleUrl: './word-list.component.css'
})
export class WordListComponent implements OnInit {
  @Input() words: Palabra[] = [];
  NPalabras: number = -1;
  wordLimit: number = 5;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['words']) {
      this.words = navigation.extras.state['words'];
      this.NPalabras = this.words.length;
    } else if (this.words.length > 0) {
      this.NPalabras = this.words.length;
    }
  }

  loadMore(): void {
    this.wordLimit += 5;
  }
}
