import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { VideoManagerService } from '../services/video-manager.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-reports',
  imports: [CommonModule],
  templateUrl: './view-reports.component.html',
  styleUrl: './view-reports.component.css'
})
export class ViewReportsComponent implements OnInit {
  reports: any = [];
  NotVisibleReports: any = [];
  showingNotVisible: boolean = true;

  constructor(private apiService: ApiService, private videoManager: VideoManagerService) { }
  ngOnInit(): void {
      this.apiService.getReports().subscribe({
        next: (response: any) => {    
          console.log('Reportes obtenidos:', response);
          for (let i = 0; i < response.reportesVisibles.length; i++) {
            response.reportesVisibles[i].video.url = this.videoManager.getSafeUrl(this.videoManager.getEmbedUrl(response.reportesVisibles[i].video.url));
          }

          for (let i = 0; i < response.reportesNoVisibles.length; i++) {
            response.reportesNoVisibles[i].video.url = this.videoManager.getSafeUrl(this.videoManager.getEmbedUrl(response.reportesNoVisibles[i].video.url));
          }
          this.reports = response.reportesVisibles;
          this.NotVisibleReports = response.reportesNoVisibles;
        },
        error: (error: any) => {
          console.error('Error al obtener los reportes:', error);
        }
      });
  }

  banVideo(id: number, reportID: number){
    this.apiService.banVideo(id, reportID).subscribe({
      next: (response: any) => {
        console.log('Video baneado:', response);
        this.NotVisibleReports = this.NotVisibleReports.filter((report: any) => report.id !== id);
        this.reports = this.reports.filter((report: any) => report.id !== id);

      },
      error: (error: any) => {
        console.error('Error al banear el video:', error);
      }
    });
  }

  hideReport(id: number){
    this.apiService.hideReport(id).subscribe({
      next: (response: any) => {
        this.NotVisibleReports = [
          ...this.NotVisibleReports,
          ...this.reports.filter((report: any) => report.id === id)
        ];
        this.reports = this.reports.filter((report: any) => report.id !== id);
      },
      error: (error: any) => {
        console.error('Error al banear el video:', error);
      }
    });
  }

  updateShowingReports(){
    this.showingNotVisible = !this.showingNotVisible;
  }
}
