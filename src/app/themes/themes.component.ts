import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Video } from '../models/video';
import { VideoManagerService } from '../services/video-manager.service';
import { VideoListComponent } from '../video-list/video-list.component';
import { ApiService } from '../services/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-themes',
  imports: [FormsModule, CommonModule, VideoListComponent],
  templateUrl: './themes.component.html',
  styleUrl: './themes.component.css'
})
export class ThemesComponent implements OnInit, AfterViewInit {
  @Input() initialTag?: string; 

  tagsFromApi: string[] = [];
  tags: string[] = [];
  videos: Video[] = [];
  dropdownOpen = false;

  constructor(
    private videoService: VideoManagerService,
    private apiService: ApiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
      this.apiService.getTagsFromApi().subscribe({
        next: (response: string[]) => (this.tagsFromApi = response),
        error: (err) => console.error('Error al obtener las etiquetas:', err)
      });

    
    const paramTag = this.route.snapshot.paramMap.get('tag');

    const seedTag = paramTag?.trim() || this.initialTag?.trim();
    if (seedTag) {
      this.tags = [seedTag];
      this.getVideosFromApi(this.tags);
    }
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
