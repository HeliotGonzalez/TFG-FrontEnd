import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyVideosCorrectedComponent } from './my-videos-corrected.component';

describe('MyVideosCorrectedComponent', () => {
  let component: MyVideosCorrectedComponent;
  let fixture: ComponentFixture<MyVideosCorrectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyVideosCorrectedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyVideosCorrectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
