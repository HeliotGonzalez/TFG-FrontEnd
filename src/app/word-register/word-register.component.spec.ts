import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordRegisterComponent } from './word-register.component';

describe('WordRegisterComponent', () => {
  let component: WordRegisterComponent;
  let fixture: ComponentFixture<WordRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WordRegisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WordRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
