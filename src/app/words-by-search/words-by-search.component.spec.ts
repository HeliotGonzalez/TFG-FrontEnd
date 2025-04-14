import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordsBySearchComponent } from './words-by-search.component';

describe('WordsBySearchComponent', () => {
  let component: WordsBySearchComponent;
  let fixture: ComponentFixture<WordsBySearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WordsBySearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WordsBySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
