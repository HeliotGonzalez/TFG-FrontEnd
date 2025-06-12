// personal-quizz.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
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
  video: any;
}

@Component({
  selector: 'app-personal-quizz',
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
  currentResultIndex = 0;

  constructor(
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

  resetQuizz(){
    this.currentIndex = 0; 
    this.results = []; 
    this.quizFinished = false;
    this.buildQuizCards();
  }

  verificar(): void {
    const correctWord = this.quizCards[this.currentIndex].word;
    const answer = this.userAnswer.trim().toLowerCase();
    this.results.push({ word: correctWord, answer, correct: answer === correctWord, video: this.quizCards[this.currentIndex].videoUrl });
    this.userAnswer = '';
    this.currentIndex++;
    if (this.currentIndex >= this.quizCards.length) {
      this.mostrarResumen();
    }
  }

  private mostrarResumen(): void {
    this.quizFinished = true;
  }

    /** Navega al resultado anterior */
  prev(): void {
    if (this.currentResultIndex > 0) {
      this.currentResultIndex--;
    }
  }

  /** Navega al resultado siguiente */
  next(): void {
    if (this.currentResultIndex < this.results.length - 1) {
      this.currentResultIndex++;
    }
  }

    /** Resultado que se muestra en pantalla */
  get currentResult() {
    return this.results?.[this.currentResultIndex] ?? null;
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
