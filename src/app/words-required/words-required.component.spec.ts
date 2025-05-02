import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordsRequiredComponent } from './words-required.component';

describe('WordsRequiredComponent', () => {
  let component: WordsRequiredComponent;
  let fixture: ComponentFixture<WordsRequiredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WordsRequiredComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WordsRequiredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
