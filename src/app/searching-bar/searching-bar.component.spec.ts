import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchingBarComponent } from './searching-bar.component';

describe('SearchingBarComponent', () => {
  let component: SearchingBarComponent;
  let fixture: ComponentFixture<SearchingBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchingBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchingBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
