import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockDetailsWrapperComponent } from './stock-details-wrapper.component';

describe('StockDetailsWrapperComponent', () => {
  let component: StockDetailsWrapperComponent;
  let fixture: ComponentFixture<StockDetailsWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockDetailsWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockDetailsWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
