import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }  from '@angular/forms';
import Swal from 'sweetalert2';
import { ApiService } from '../services/api.service';
import { DailyChallengeItem } from '../models/daily-challenge-item';
import { VideoManagerService } from '../services/video-manager.service';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';

interface QuizCard {
  videoUrl: SafeResourceUrl;
  word: string;
}
interface Result {
  word: string;
  answer: string;
  correct: boolean;
  video: SafeResourceUrl;
}

@Component({
  selector: 'app-daily-challenge',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './daily-challenge.component.html',
  styleUrls: ['./daily-challenge.component.css']
})
export class DailyChallengeComponent implements OnInit {

  quizCards: QuizCard[] = [];
  results:    Result[]  = [];
  currentIndex = 0;
  currentResultIndex = 0;
  userAnswer  = '';
  quizFinished = false;
  loading = true;

  constructor(
    private api: ApiService,
    private vm:  VideoManagerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.api.checkLastDailyChallenge(this.vm.ensureAuthenticated()).subscribe({
      next: (response: any) => {
        console.log(response);
        if (response && response.message == 'ok'){
          Swal.fire({
            title: 'Reto diario ya completado',
            text:  'Ya has completado el reto diario de hoy. ¡Vuelve mañana para un nuevo desafío!',
            icon:  'info',
            confirmButtonText: 'Aceptar',
            customClass: { confirmButton: 'btn btn-primary' },
            buttonsStyling: false
          }).then(() => {
            this.loading = false;
            this.router.navigate(['/']);
          })
        }
      },
      error: (err: any) => {
        console.error('Error al cargar el reto diario:', err);
      }
    })

    this.api.getDailyChallenge().subscribe({
      next: rows => {
        this.quizCards = rows.map((r: DailyChallengeItem) => ({
          word: r.palabra.trim().toLowerCase(),
          videoUrl: this.vm.getSafeUrl(this.vm.getEmbedUrl(r.video_url))
        }));
        this.resetQuizState();
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error al cargar el reto diario:', err);
        this.loading = false;
        Swal.fire('Error', 'No se pudo cargar el reto diario', 'error');
      }
    });
  }

  verificar(): void {
    const correctWord = this.quizCards[this.currentIndex].word;
    const answer      = this.userAnswer.trim().toLowerCase();

    this.results.push({
      word: correctWord,
      answer,
      correct: answer === correctWord,
      video:   this.quizCards[this.currentIndex].videoUrl      // ⬅︎ guardamos vídeo
    });

    this.userAnswer = '';
    this.currentIndex++;

    if (this.currentIndex >= this.quizCards.length) this.mostrarResumen();
  }

  private mostrarResumen(): void {
    this.quizFinished = true;

    Swal.fire({
      title: `Resultados: ${this.correctCount}/${this.totalQuestions} aciertos`,
      icon:  this.correctCount === this.totalQuestions ? 'success' : 'info',
      html:  `<p>Has acertado <strong>${this.correctCount}</strong> de ${this.totalQuestions} preguntas.</p>
              <p>Palabras incorrectas: 
                 <em>${this.wrongWords.length ? this.wrongWords.join(', ') : 'ninguna'}</em></p>`,
      confirmButtonText: 'Ver detalles',
      customClass: { confirmButton: 'btn btn-primary' },
      buttonsStyling: false
    });
    
    this.api.sendResults(this.correctCount, this.vm.ensureAuthenticated());
  }

  private resetQuizState(): void {
    this.currentIndex       = 0;
    this.results            = [];
    this.quizFinished       = false;
    this.currentResultIndex = 0;          // ⬅︎ reiniciar también
  }

  /* ---------- getters ---------- */
  get currentResult(): Result | null {
    return this.results[this.currentResultIndex] ?? null;
  }
  get totalQuestions(): number { return this.results.length; }
  get correctCount(): number   { return this.results.filter(r => r.correct).length; }
  get wrongWords(): string[]   { return this.results.filter(r => !r.correct).map(r => r.word); }

  /* ---------- navegación entre resultados ---------- */
  prev(): void { if (this.currentResultIndex > 0) this.currentResultIndex--; }
  next(): void { if (this.currentResultIndex < this.results.length - 1) this.currentResultIndex++;}
}
