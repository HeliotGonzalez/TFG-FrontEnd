import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Video } from '../models/video';
import { VideoManagerService } from '../services/video-manager.service';
import { VideoListComponent } from '../video-list/video-list.component';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-themes',
  imports: [FormsModule, CommonModule, VideoListComponent],
  templateUrl: './themes.component.html',
  styleUrl: './themes.component.css'
})
export class ThemesComponent implements OnInit, AfterViewInit {
  tagsFromApi: string[] = [];
  tags: string[] = [];
  videos: Video[] = [];
  dropdownOpen = false;

  constructor(
    private videoService: VideoManagerService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.apiService.getTagsFromApi().subscribe({
      next: (response: string[]) => (this.tagsFromApi = response),
      error: (err) => console.error('Error al obtener las etiquetas:', err)
    });
  }

  ngAfterViewInit(): void {
      scrollTo(0, 0);
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  onSelectTag(tag: string, event: MouseEvent): void {
    event.preventDefault();
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
      this.getVideosFromApi(this.tags);
    }
    this.dropdownOpen = false;
  }

  removeTag(index: number): void {
    this.tags.splice(index, 1);
    this.getVideosFromApi(this.tags);
  }

  getVideosFromApi(tags: string[]): void {
    this.videoService.getVideosByThemes(tags).subscribe({
      next: (response) => (this.videos = response),
      error: (err) => console.error('Error al obtener los vídeos:', err)
    });
  }
}
