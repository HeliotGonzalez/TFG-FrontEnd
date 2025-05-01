import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../app/services/api.service';
import { Palabra } from '../models/palabra';
import { WordListComponent } from '../word-list/word-list.component';
import Swal from 'sweetalert2';
import { VideoManagerService } from '../services/video-manager.service';

@Component({
  selector: 'app-alfabeto',
  imports: [RouterModule, CommonModule, WordListComponent],
  templateUrl: './alfabeto.component.html',
  styleUrls: ['./alfabeto.component.css']
})

export class AlfabetoComponent implements OnInit {
  letters = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');
  currentLetter = 'A';
  NPalabras: number = -1;
  words: Palabra[] = [];
  wordLimit: number = 5;

  constructor(
    private apiService: ApiService,
    private videoManager: VideoManagerService
  ) {}

  ngOnInit(): void {
    this.loadWords();
  }

  onLetterClick(letter: string): void {
    this.currentLetter = letter;
    this.loadWords();
  }

  loadWords(): void {
    this.apiService.getWords(this.currentLetter).subscribe({
      next: (response: any) => {
        this.words = response.map((word: any) => {
          if (word.significado?.highest_voted_video) {
            const video = word.significado.highest_voted_video;
            video.embedUrl = this.videoManager.getSafeUrl(this.videoManager.getEmbedUrl(video.url));
          }
          return word;
        });
        this.NPalabras = this.words.length;
      },
      error: (error: any) => {
        console.error('Error al cargar las palabras:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ha ocurrido un error: '
        });
      }
    });
  }
}
