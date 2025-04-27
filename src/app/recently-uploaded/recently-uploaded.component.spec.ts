import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentlyUploadedComponent } from './recently-uploaded.component';

describe('RecentlyUploadedComponent', () => {
  let component: RecentlyUploadedComponent;
  let fixture: ComponentFixture<RecentlyUploadedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentlyUploadedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentlyUploadedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
