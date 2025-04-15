import { AfterViewInit, Component, OnInit } from '@angular/core';
import { WordListComponent } from '../word-list/word-list.component';
import { ApiService } from '../services/api.service';
import { RouterModule } from '@angular/router';
import { Palabra } from '../models/palabra';
import { VideoManagerService } from '../services/video-manager.service';
import Swal from 'sweetalert2';
declare var bootstrap: any;


@Component({
  selector: 'app-random-word',
  imports: [WordListComponent],
  templateUrl: './random-word.component.html',
  styleUrl: './random-word.component.css'
})
export class RandomWordComponent implements OnInit, AfterViewInit {
  words: Palabra[] = [];


  constructor(private apiService: ApiService, private videoManager: VideoManagerService){}

  ngOnInit(): void {
    this.apiService.getRandomWords().subscribe({
      next: (response: any) => {
        this.words = response.map((word: any) => {
          if (word.significado?.highest_voted_video) {
            const video = word.significado.highest_voted_video;
            video.embedUrl = this.videoManager.getSafeUrl(this.videoManager.getEmbedUrl(video.url));
          }
          return word;
        });
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

  ngAfterViewInit(): void {
    window.scrollTo(0, 0); 
  }

  loadMore(){
    this.words.shift();
    if (this.words.length === 0) this.ngOnInit();
  }

}
