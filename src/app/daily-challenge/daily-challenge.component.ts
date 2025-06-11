import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }  from '@angular/forms';
import Swal from 'sweetalert2';
import { ApiService } from '../services/api.service';
import { DailyChallengeItem } from '../models/daily-challenge-item';
import { VideoManagerService } from '../services/video-manager.service';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';

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
  selector: 'app-daily-challenge',
  imports: [CommonModule, FormsModule],
  templateUrl: './daily-challenge.component.html',
  styleUrls: ['./daily-challenge.component.css']
})
export class DailyChallengeComponent implements OnInit {

  quizCards: QuizCard[] = [];
  results:    Result[]  = [];
  currentIndex = 0;
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
    this.results.push({ word: correctWord, answer, correct: answer === correctWord });
    this.userAnswer = '';
    this.currentIndex++;

    if (this.currentIndex >= this.quizCards.length) this.mostrarResumen();
  }

  private mostrarResumen(): void {
    this.quizFinished = true;
    const correct = this.correctCount;
    const total   = this.totalQuestions;
    const wrongs  = this.wrongWords;

    Swal.fire({
      title: `Resultados: ${correct}/${total} aciertos`,
      icon:  correct === total ? 'success' : 'info',
      html: `
        <p>Has acertado <strong>${correct}</strong> de ${total} preguntas.</p>
        <p>Palabras incorrectas: <em>${wrongs.length ? wrongs.join(', ') : 'ninguna'}</em></p>
      `,
      confirmButtonText: 'Cerrar',
      customClass: { confirmButton: 'btn btn-primary' },
      buttonsStyling: false
    }).then(() => {
      this.router.navigate(['/']);
    });

    this.api.sendResults(this.correctCount, this.vm.ensureAuthenticated()).subscribe({
      next: (response: any) => {
        console.log('Resultados enviados correctamente:', response);
      },
      error: (err: any) => {
        console.error('Error al enviar resultados:', err);
      }
    });
  }

  private resetQuizState() {
    this.currentIndex = 0;
    this.results      = [];
    this.quizFinished = false;
  }

  /* ---- Getters para estadísticas ---- */
  get totalQuestions(): number { return this.results.length; }
  get correctCount(): number   { return this.results.filter(r => r.correct).length; }
  get wrongWords(): string[]   { return this.results.filter(r => !r.correct).map(r => r.word); }
}
