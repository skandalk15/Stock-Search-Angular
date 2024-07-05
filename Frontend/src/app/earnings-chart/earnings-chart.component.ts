import { Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-earnings-chart',
  templateUrl: './earnings-chart.component.html',
  styleUrls: ['./earnings-chart.component.css']
})
export class EarningsChartComponent implements OnInit {

  @Input() earnings:any;
  actual:any = [];
  estimate: any=[];
  surprise: any = [];
  categories:any =[];

  constructor() { }

  highcharts = Highcharts;
   chartOptions: any = {   
      chart: {
        type: 'spline',
        backgroundColor: '#f7f7f7'
      },
      title: {
        text: 'Historical EPS Surprises'
      },
      subtitle : {
         style: {
            position: 'absolute',
            right: '0px',
            bottom: '10px'
         }
      },
      // legend : {
      //    layout: 'vertical',
      //    align: 'left',
      //    verticalAlign: 'top',
      //    x: -150,
      //    y: 100,
      //    floating: true,
      //    borderWidth: 1,
        
      //    backgroundColor: 
      //         '#FFFFFF'
      // },
      xAxis:[{
         categories: this.categories
      },
      {
        categories: this.surprise
      }
    ]
    ,
      yAxis : {
         title: {
            text: 'Quarterly EPS'
         }
      },
      tooltip : {
         shared: true,
      },
      plotOptions : {
         area: {
            fillOpacity: 0.5 
         }
      },
      credits:{
        enabled: false
      },
      series: [
         {
            name: 'Actual',
            data: this.actual
         }, 
         {
            name: 'Estimate',
            data: this.estimate
         },
      ]
   };

  ngOnInit(): void {


   this.earnings = this.earnings.map(element=>{
      if(element.actual==null){
         element.actual = 0
      }
      if(element.estimate==null){
         element.estimate=0
      }
      if(element.surprise==null){
         element.surprise=0
      }
      return element

   })
   // this.earnings = this.earnings.map(element=>(element.estimate!=null))

    this.earnings.forEach(element=>{
      this.actual.push(element.actual)
      this.estimate.push(element.estimate)
      this.surprise.push(element.surprise)
      this.categories.push(element.period.substring(0,10)+'<br/>Surprise: '+element.surprise)

    })
  }

}
