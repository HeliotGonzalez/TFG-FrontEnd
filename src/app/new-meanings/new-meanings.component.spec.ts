import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMeaningsComponent } from './new-meanings.component';

describe('NewMeaningsComponent', () => {
  let component: NewMeaningsComponent;
  let fixture: ComponentFixture<NewMeaningsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewMeaningsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewMeaningsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
