import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import * as Highcharts from "highcharts/highstock";
import {Options} from "highcharts/highstock";

import IndicatorsCore from "highcharts/indicators/indicators";
import IndicatorZigzag from "highcharts/indicators/zigzag";
import IndicatorVBP from "highcharts/indicators/volume-by-price";

IndicatorsCore(Highcharts);
IndicatorZigzag(Highcharts);
IndicatorVBP(Highcharts);

@Component({
  selector: 'app-stock-chart-ohlc',
  templateUrl: './stock-chart-ohlc.component.html'
  // styleUrls: ['./stock-chart-ohlc.component.css']
})
export class StockChartOhlcComponent implements OnInit {

  @Input() stockHistory = [];
  @Input() ticker;
  @Input() chartColor: string = "grey";
  @Input() rangeSelectorEnable: boolean = false;

  chartOptions: Options;
  Highcharts: typeof Highcharts;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges(change: SimpleChanges) {
    this.Highcharts = Highcharts;

    this.chartOptions = {
      chart:{
        backgroundColor: '#f7f7f7'
      },
      rangeSelector: {
        selected: 2
      },

      title: {
        text: `${this.ticker} Historical`
      },

      subtitle: {
        text: 'With SMA and Volume by Price technical indicators'
      },

      yAxis: [{
        startOnTick: false,
        endOnTick: false,
        labels: {
          align: 'right',
          x: -3
        },
        title: {
          text: 'OHLC'
        },
        height: '60%',
        lineWidth: 2,
        resize: {
          enabled: true
        }
      }, {
        labels: {
          align: 'right',
          x: -3
        },
        title: {
          text: 'Volume'
        },
        top: '65%',
        height: '35%',
        offset: 0,
        lineWidth: 2
      }],

      tooltip: {
        split: true
      },


      series: [{
        type: 'candlestick',
        name: `${this.ticker}`,
        id: `${this.ticker}`,
        zIndex: 2,
        data: this.stockHistory['ohlc']
      }, {
        type: 'column',
        name: 'Volume',
        id: 'volume',
        data: this.stockHistory['volume'],
        yAxis: 1
      }, {
        type: 'vbp',
        linkedTo: `${this.ticker}`,
        params: {
          volumeSeriesID: 'volume'
        },
        dataLabels: {
          enabled: false
        },
        zoneLines: {
          enabled: false
        }
      }, {
        type: 'sma',
        linkedTo: `${this.ticker}`,
        zIndex: 1,
        marker: {
          enabled: false
        }
      }]
    };
  }
}
