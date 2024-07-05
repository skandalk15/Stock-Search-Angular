import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockChartOhlcComponent } from './stock-chart-ohlc.component';

describe('StockChartOhlcComponent', () => {
  let component: StockChartOhlcComponent;
  let fixture: ComponentFixture<StockChartOhlcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockChartOhlcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockChartOhlcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
