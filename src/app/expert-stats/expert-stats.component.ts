import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { ApiService } from '../services/api.service';
import { Subject, takeUntil } from 'rxjs';

interface MesCount {
  mes: number;
  total: number;
}

interface ExpertStatResponse {
  userVideo: { user: { id: number; name: string }; total: number }[];
  videosPerMonth: MesCount[];
  nVideosLastMonth: number;
  nWords: number;
  nVideosUncorrected: number;
  mostPoints: { username: string; points: number }[];
}

@Component({
  selector: 'app-expert-stats',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './expert-stats.component.html',
  styleUrls: ['./expert-stats.component.css'],
})
export class ExpertStatsComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  /** ---------- datos de servidor ---------- */
  userVideo: ExpertStatResponse['userVideo'] = [];
  nVideos = -1;
  nVideosLastMonth = -1;
  nWords = -1;
  nVideosUncorrected = -1;
  mostPoints: ExpertStatResponse['mostPoints'] = [];
  videosPerMonth: MesCount[] = [];

  /** ---------- Chart.js ---------- */
  @ViewChild('videosChart', { static: false })
  private chartRef?: ElementRef<HTMLCanvasElement>;
  private chart?: Chart;
  private destroyed$ = new Subject<void>();

  constructor(private apiService: ApiService) {
    Chart.register(...registerables);
  }

  /* ===== ciclo de vida ===== */

  ngOnInit(): void {
    this.apiService
      .getExpertStatData()
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (response: any) => {
          this.userVideo = response[0];
          this.videosPerMonth = response[1];
          this.nVideos = this.userVideo.reduce((acc, u) => acc + u.total, 0);
          this.nVideosLastMonth = response[2];
          this.nWords = response[3];
          this.nVideosUncorrected = response[4];
          this.mostPoints = response[5];

          if (this.videosPerMonth.length) {
            // Esperamos al siguiente ciclo de cambio para asegurar que el canvas existe
            setTimeout(() => this.buildChart());
          }
        },
        error: (err) =>
          console.error('Error al cargar estadísticas:', err),
      });
  }

  ngAfterViewInit(): void {
    scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /* ===== helpers ===== */

  private buildChart(): void {
    if (!this.chartRef?.nativeElement) {
      console.warn('Canvas no disponible todavía');
      return;
    }

    this.chart?.destroy();

    const labels = this.videosPerMonth.map((v) => this.monthName(v.mes));
    const data = this.videosPerMonth.map((v) => v.total);

    const cfg: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Vídeos',
            data,
            backgroundColor: '#F3CA52',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1 } },
        },
      },
    };

    this.chart = new Chart(this.chartRef.nativeElement, cfg);
  }

  private monthName(m: number): string {
    return (
      [
        '',
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre',
      ][m] ?? `Mes ${m}`
    );
  }
}
