import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-expert-stats',
  imports: [CommonModule, RouterModule],
  templateUrl: './expert-stats.component.html',
  styleUrl: './expert-stats.component.css'
})
export class ExpertStatsComponent implements OnInit, AfterViewInit {
  UserVideo: any;
  NVideos: number = -1;
  NVideosLastMonth: number = -1;
  NWords: number = -1;
  NVideosUncorrected = -1;
  mostPoints: any[] = [];


  constructor(private apiService: ApiService){}

  ngOnInit(): void {
      this.apiService.getExpertStatData().subscribe({
        next: (response: any) => {
          console.log(response);
          this.UserVideo = response[0];
          this.NVideos = response[1];
          this.NVideosLastMonth = response[2];
          this.NWords = response[3];
          this.NVideosUncorrected = response[4];
          this.mostPoints = response[5];
          console.log(this.UserVideo);
        },
        error: (err: any) => {
          console.log('El error obtenido es: ', err);
        }
      });
  }

  ngAfterViewInit(): void {
      scrollTo(0, 0);
  }
}
