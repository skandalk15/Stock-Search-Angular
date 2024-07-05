import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import * as Highcharts from "highcharts/highstock";
import {Options} from "highcharts/highstock";

import IndicatorsCore from "highcharts/indicators/indicators";
import IndicatorZigzag from "highcharts/indicators/zigzag";

IndicatorsCore(Highcharts);
IndicatorZigzag(Highcharts);

@Component({
  selector: 'app-temp-chart',
  templateUrl: './temp-chart.component.html'
  // styleUrls: ['./temp-chart.component.css']
})
export class TempChartComponent implements OnInit {
  @Input() stockHistory = [];
  @Input() ticker;
  @Input() chartColor: string = "grey";
  @Input() rangeSelectorEnable: boolean = false;
  times:any = [];

  chartOptions: Options;
  Highcharts: typeof Highcharts;

  constructor() {
  }

  ngOnInit(): void {
    this.stockHistory.forEach(element=>{
      this.times.push(element[0])
    })

  }

  ngOnChanges(change: SimpleChanges) {
    this.Highcharts = Highcharts;

    this.chartOptions = {
      chart:{
        backgroundColor: '#f7f7f7'
      },
      title: {
        text: `${this.ticker} Hourly Price Variation`,
        style: {
          color: 'grey'
        }
      },
      // xAxis:{
      //   type: 'datetime',
      //   categories: this.times,
      // },
      // time: {
      //   timezoneOffset: 420
      // },
      rangeSelector: {
        enabled: false
      },
      navigator: {
            enabled: false
        },
    //     tooltip: {
    //     xDateFormat: '%H:%M',
    //     shared: true
    // },
      series: [
        {
          type: "line",
          color: this.chartColor,
          name: `${this.ticker}`,
          id: "base",
          data: this.stockHistory
        },
      ]
    };
  }

}
