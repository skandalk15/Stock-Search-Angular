import { Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-recommendation-chart',
  templateUrl: './recommendation-chart.component.html',
  styleUrls: ['./recommendation-chart.component.css']
})
export class RecommendationChartComponent implements OnInit {

  @Input() recommendation:any;
  strongBuyVals:any = [];
  buyVals:any = [];
  holdVals:any = [];
  sellVals:any =[];
  strongSellVals:any= [];
  months:any=[];
//   highcharts: any;
//   chartOptions:any;


  constructor() { }

  highcharts = Highcharts;
   chartOptions: any = {   
      chart: {
         type: 'column',
         backgroundColor: '#f7f7f7'
      },
      colors:['#176f37','#1db954','#b98b1d','#f45b5b','#813131'],
      title: {
         text: 'Recommendation Trends'
      },
      // legend : {
      //    layout: 'vertical',
      //    align: 'right',
      //    verticalAlign: 'top',
      //   //  x: 250,
      //   y: 20,
      //    floating: true,
      //    borderWidth: 1,
        
      //    backgroundColor: ('#FFFFFF'), shadow: true
      // },
      xAxis:{
         categories: this.months, title: {
            text: null
         } 
      },
      yAxis : {
         min: 0,
         title: {
            text: '#Analysis',
            align: 'middle'
         },
         labels: {
            overflow: 'justify'
         }
      },
      tooltip : {
         // valueSuffix: ' millions'
      },
      plotOptions : {
         column: {
            dataLabels: {
               enabled: true
            }
         },
         series: {
            stacking: 'normal'
         }
      },
      credits:{
         enabled: false
      },
      series: [
         {
            name: 'Strong Buy',
            data: this.strongBuyVals
            // data: [1,2,3,4]
         }, 
         {
            name: 'Buy',
            data: this.buyVals
            // data: [1,2,3,4]
         }, 
         {
            name: 'Hold',
            data: this.holdVals  
            // data: [1,2,3,4] 
         },
         {
            name: 'Sell',
            data: this.sellVals  
            // data: [1,2,3,4]   
         },
         {
            name: 'Strong Sell',
            data: this.strongSellVals  
            // data: [1,2,3,4]
         }
      ]
   };

  
  ngOnInit(): void {
    
    this.recommendation.forEach(element=>{
      this.strongBuyVals.push(element.strongBuy)
      this.buyVals.push(element.buy)
      this.holdVals.push(element.hold)
      this.sellVals.push(element.sell)
      this.strongSellVals.push(element.strongSell)
      this.months.push(element.period.substring(0,7))
    })
   

  }

  ngOnChanges(){

  


  }

}
