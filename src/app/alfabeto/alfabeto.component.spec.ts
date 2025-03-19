import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlfabetoComponent } from './alfabeto.component';

describe('AlfabetoComponent', () => {
  let component: AlfabetoComponent;
  let fixture: ComponentFixture<AlfabetoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlfabetoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlfabetoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
