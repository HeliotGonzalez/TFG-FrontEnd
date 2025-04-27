// personal-quizz.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Video } from '../models/video';
import { VideoManagerService } from '../services/video-manager.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface QuizCard {
  videoUrl: SafeResourceUrl;
  word: string;
}
interface Result {
  word: string;
  answer: string;
  correct: boolean;
}

@Component({
  selector: 'app-personal-quizz',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './personal-quizz.component.html',
  styleUrls: ['./personal-quizz.component.css']
})
export class PersonalQuizzComponent implements OnInit {
  @Input() videos: Video[] = [];
  quizCards: QuizCard[] = [];
  results: Result[] = [];
  currentIndex = 0;
  userAnswer = '';
  quizFinished = false;

  constructor(
    private sanitizer: DomSanitizer,
    private videoManager: VideoManagerService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const raw = params.get('data');
      if (raw) {
        try {
          this.videos = JSON.parse(decodeURIComponent(raw));
        } catch {
          console.error('No pude parsear los vídeos de la URL');
          this.videos = [];
        }
      }

      this.buildQuizCards();
    });
  }

  private buildQuizCards(): void {
    this.quizCards = this.videos.map(v => ({
      videoUrl: this.videoManager.getSafeUrl(
        this.videoManager.getEmbedUrl(v.url)
      ),
      word: v.nombre.trim().toLowerCase()
    }));

    this.currentIndex = 0;
    this.results = [];
    this.quizFinished = false;
  }

  verificar(): void {
    const correctWord = this.quizCards[this.currentIndex].word;
    const answer = this.userAnswer.trim().toLowerCase();
    this.results.push({ word: correctWord, answer, correct: answer === correctWord });
    this.userAnswer = '';
    this.currentIndex++;
    if (this.currentIndex >= this.quizCards.length) {
      this.mostrarResumen();
    }
  }

  private mostrarResumen(): void {
    this.quizFinished = true;
    const correctCount = this.correctCount;
    const total = this.totalQuestions;
    const wrongs = this.wrongWords;
    Swal.fire({
      title: `Resultados: ${correctCount}/${total} aciertos`,
      icon: correctCount === total ? 'success' : 'info',
      html: `
        <p>Has acertado <strong>${correctCount}</strong> de ${total} preguntas.</p>
        <p>Palabras incorrectas: <em>${wrongs.length ? wrongs.join(', ') : 'ninguna'}</em></p>
      `,
      confirmButtonText: 'Cerrar',
      customClass: { confirmButton: 'btn btn-primary' },
      buttonsStyling: false
    });
  }

  // Getters para estadísticas
  get totalQuestions(): number {
    return this.results.length;
  }
  get correctCount(): number {
    return this.results.filter(r => r.correct).length;
  }
  get wrongCount(): number {
    return this.results.filter(r => !r.correct).length;
  }
  get wrongWords(): string[] {
    return this.results.filter(r => !r.correct).map(r => r.word);
  }
}
