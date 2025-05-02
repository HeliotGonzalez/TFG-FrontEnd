import { Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-modify-profile',
  templateUrl: './modify-profile.component.html',
  styleUrls: ['./modify-profile.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class ModifyProfileComponent implements OnInit, OnChanges {
  @Input() userData: any;
  profileForm!: FormGroup;
  avatarPreview: string | ArrayBuffer | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router
  ) {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras.state as Record<string, any>;
    this.userData = state?.['userData'];
    console.log(this.userData);
  }

  ngOnInit(): void {
    if (!this.userData) {
      this.location.back();
      return;
    }
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userData'] && !changes['userData'].firstChange) {
      this.initForm();
    }
  }

  private initForm(): void {
    this.profileForm = this.fb.group({
      name: [this.userData.name, [Validators.required, Validators.minLength(2)]],
      username: [this.userData.username, [Validators.required, Validators.minLength(2)]],
      email: [this.userData.email, [Validators.required, Validators.email]],
      descricion: [this.userData.descricion || ''],
      avatar: [null]
    });
  }

  onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.profileForm.patchValue({ avatar: file });
      const reader = new FileReader();
      reader.onload = () => this.avatarPreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.profileForm.invalid) return;
    this.loading = true;

    const formData = new FormData();
    Object.entries(this.profileForm.value).forEach(([key, val]) => {
      if (val !== null) formData.append(key, val as any);
    });

    this.apiService.updateProfile(this.profileForm.value, this.userData.id).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.location.back();
      },
      error: (err: any) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.location.back();
  }
}
