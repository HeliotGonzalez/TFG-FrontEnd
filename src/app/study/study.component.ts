import { Component, AfterViewInit } from '@angular/core';
import { VideoManagerService } from '../services/video-manager.service';
import { Video } from '../models/video';
import { Router } from '@angular/router';

@Component({
  selector: 'app-study',
  imports: [],
  templateUrl: './study.component.html',
  styleUrl: './study.component.css'
})
export class StudyComponent implements AfterViewInit{
  videos: Video[] = [];

  constructor(private videoManager: VideoManagerService, private router: Router){}

  ngAfterViewInit(): void {
    window.scrollTo(0, 0); 
  }

  testYourself(route: string){
    this.videoManager.testYourself().subscribe({
      next: (response: Video[]) => {
        this.videos = response;
        const payload = encodeURIComponent(JSON.stringify(this.videos));
        this.router.navigate([route], {queryParams: { data: payload }});
      },
      error: (err: any) => {
        console.log('Error ', err);
      }
    });
  }



  iniciarCuestionarioDiario(){

  }

  

}
