import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomWordComponent } from './random-word.component';

describe('RandomWordComponent', () => {
  let component: RandomWordComponent;
  let fixture: ComponentFixture<RandomWordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RandomWordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RandomWordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
