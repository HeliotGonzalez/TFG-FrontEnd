import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlashccardsComponent } from './flashccards.component';

describe('FlashccardsComponent', () => {
  let component: FlashccardsComponent;
  let fixture: ComponentFixture<FlashccardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlashccardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlashccardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
