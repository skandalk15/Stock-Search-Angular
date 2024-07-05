import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import * as Highcharts from 'highcharts';
import {chart} from "highcharts";
// import {StockChart} from "angular-highcharts";

declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);

@Component({
  selector: 'app-stock-chart',
  templateUrl: './stock-chart.component.html'
  // styleUrls: ['./stock-chart.component.css']
})

export class StockChartComponent implements OnInit {
  @Input() stockHistory: any = [];
  @Input() ticker: string = "";
  chart: any;
  public options: any ;


  constructor() { }

  ngOnInit(){
  }

  ngOnChanges(change: SimpleChanges){
    this.options = {
      chart:{
        backgroundColor: '#f7f7f7'
      },
      rangeSelector: {
        selected: 2
      },

      title: {
        text: 'AAPL Historical'
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
      series: [{
        type: 'candelstick',
        name: 'AAPL',
        id: 'aapl',
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
        linkedTo: 'aapl',
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
        linkedTo: 'aapl',
        zIndex: 1,
        marker: {
          enabled: false
        }
      }]
    }

    Highcharts.stockChart('containerChartForTicker', this.options);

  }
}
