import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';

/** Estructura local para que el código sea más legible */
export interface ProposedMeaning {
  id: number;
  palabra: string;
  descripcion_antigua: string;
  descripcion_propuesta: string;
  user: { id: number; username: string };
}

@Component({
  selector: 'app-new-meanings',
  imports: [CommonModule],
  templateUrl: './new-meanings.component.html',
  styleUrl: './new-meanings.component.css'
})
export class NewMeaningsComponent implements OnInit, AfterViewInit {
  possibleNewMeanings: ProposedMeaning[] = [];
  loadingId: number | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadProposals();
  }

  ngAfterViewInit(): void {
    scrollTo(0,0);
  }

  /** Cargar propuestas desde la API */
  private loadProposals(): void {
    this.apiService.getNewMeanings().subscribe({
      next: (data) => {
        this.possibleNewMeanings = (data as ProposedMeaning[]) ?? [];
      },
      error: (err) => console.error('Error fetching new meanings:', err)
    });
  }

  /** Aceptar la propuesta */
  accept(p: ProposedMeaning): void {
    this.loadingId = p.id;
    this.apiService.approveMeaning(p.id, p.palabra, p.descripcion_antigua, p.descripcion_propuesta).subscribe({
      next: () => {
        this.removeFromList(p.id);
      },
      error: (err) => {
        console.error('Error approving meaning:', err);
        this.loadingId = null;
      }
    });
  }

  deny(p: ProposedMeaning): void {
    this.loadingId = p.id;

    this.apiService.rejectMeaning(p.id).subscribe({
      next: () => {
        this.removeFromList(p.id);
      },
      error: (err) => {
        console.error('Error rejecting meaning:', err);
        this.loadingId = null;
      }
    });
  }

  private removeFromList(id: number): void {
    this.possibleNewMeanings = this.possibleNewMeanings.filter(m => m.id !== id);
    this.loadingId = null;
  }
}
