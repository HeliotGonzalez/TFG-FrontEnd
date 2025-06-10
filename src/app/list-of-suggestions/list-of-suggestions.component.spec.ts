import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfSuggestionsComponent } from './list-of-suggestions.component';

describe('ListOfSuggestionsComponent', () => {
  let component: ListOfSuggestionsComponent;
  let fixture: ComponentFixture<ListOfSuggestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListOfSuggestionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListOfSuggestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
