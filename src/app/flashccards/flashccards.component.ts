import { Component, OnInit, } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Video } from '../models/video';
import { VideoManagerService } from '../services/video-manager.service';
import { CommonModule } from '@angular/common';

// Cada carta relaciona un vídeo (tipo any para TS) con su palabra única
type Carta = {
  videoUrl: any;
  palabra: string;
};

@Component({
  selector: 'app-flashcards',
  templateUrl: 'flashccards.component.html',
  styleUrls: ['flashccards.component.css'],
  imports: [CommonModule]
})
export class FlashccardsComponent implements OnInit {
  videos: Video[] = [];
  cartas: Carta[] = []; 
  iActual = 0;
  flipped = false;

  constructor(
    private route: ActivatedRoute, 
    private videoManager: VideoManagerService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const raw = params.get('data');
      if (raw) {
        try {
          this.videos = JSON.parse(decodeURIComponent(raw));
          console.log(this.videos);
        } catch {
          console.error('No pude parsear los vídeos de la URL');
          this.videos = [];
        }
      }
      // Tras recibir o inicializar videos, generar las cartas
      this.montarCartas();
    });
  }

  private montarCartas(): void {
    this.cartas = this.videos.map(v => ({
      videoUrl: this.videoManager.getSafeUrl(this.videoManager.getEmbedUrl(v.url)),
      palabra: v.nombre 
    }));
    this.iActual = 0;
    this.flipped = false;
  }

  // Alterna el estado de giro al hacer clic
  voltear(): void {
    this.flipped = !this.flipped;
  }

  // Avanza a la siguiente carta (si no está al final)
  siguiente(): void {
    if (this.iActual < this.cartas.length - 1) {
      this.iActual++;
      this.flipped = false;
    }
  }

  // Retrocede a la carta anterior (si no está al inicio)
  anterior(): void {
    if (this.iActual > 0) {
      this.iActual--;
      this.flipped = false;
    }
  }
}
