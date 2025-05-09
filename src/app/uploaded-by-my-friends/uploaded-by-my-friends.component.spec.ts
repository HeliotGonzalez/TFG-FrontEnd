import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadedByMyFriendsComponent } from './uploaded-by-my-friends.component';

describe('UploadedByMyFriendsComponent', () => {
  let component: UploadedByMyFriendsComponent;
  let fixture: ComponentFixture<UploadedByMyFriendsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadedByMyFriendsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadedByMyFriendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
