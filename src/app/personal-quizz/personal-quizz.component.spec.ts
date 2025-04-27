import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalQuizzComponent } from './personal-quizz.component';

describe('PersonalQuizzComponent', () => {
  let component: PersonalQuizzComponent;
  let fixture: ComponentFixture<PersonalQuizzComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalQuizzComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalQuizzComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
