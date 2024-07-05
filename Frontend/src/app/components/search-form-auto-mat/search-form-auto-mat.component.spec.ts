import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFormAutoMatComponent } from './search-form-auto-mat.component';

describe('SearchFormAutoMatComponent', () => {
  let component: SearchFormAutoMatComponent;
  let fixture: ComponentFixture<SearchFormAutoMatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchFormAutoMatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFormAutoMatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
