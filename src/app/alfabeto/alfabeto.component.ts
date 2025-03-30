import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../app/services/api.service';
import { Palabra } from '../models/palabra';
import { Video } from '../models/video';
import Swal from 'sweetalert2';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-alfabeto',
  imports: [RouterModule, CommonModule],
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
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadWords();
  }

  loadMore(): void {
    this.wordLimit += 5;
  }

  onLetterClick(letter: string): void {
    this.currentLetter = letter;
    this.loadWords();
  }

  loadWords(): void {
    this.apiService.getWords(this.currentLetter).subscribe({
      next: (response: any) => {
        this.words = response.map((word: any) => {
          // Si existe un video en highest_voted_video, calculamos embedUrl
          if (word.significado?.highest_voted_video) {
            const video = word.significado.highest_voted_video;
            // Asignamos embedUrl al video usando getSafeUrl y getEmbedUrl
            video.embedUrl = this.getSafeUrl(this.getEmbedUrl(video.url));
          }
          return word;
        });
        this.NPalabras = this.words.length;
      },
      error: (error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ha ocurrido un error: ' + error
        });
      }
    });
  }

  /**
   * Transforma una URL normal de YouTube a la URL de embed.
   * Por ejemplo, convierte:
   * https://www.youtube.com/watch?v=VIDEO_ID
   * en:
   * https://www.youtube.com/embed/VIDEO_ID
   */
  getEmbedUrl(url: string): string {
    let videoId = '';
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2] && match[2].length === 11) {
      videoId = match[2];
    }
    return 'https://www.youtube.com/embed/' + videoId;
  }
  

  /**
   * Utiliza el sanitizer de Angular para evitar problemas de seguridad con las URLs de vídeo.
   */
  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
