// import { ThrowStmt } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-insights',
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.css']
})
export class InsightsComponent implements OnInit {

  @Input() sentiment: any;
  @Input() recommendation:any;
  @Input() name:any;
  @Input() earnings:any;

  totalMSPR:number =0;
  positiveMSPR:number=0;
  negativeMSPR:number=0;
  totalChange:number =0;
  positiveChange:number=0;
  negativeChange:number=0;



  constructor() { }

  ngOnInit(): void {
    this.sentiment.data.forEach(element => { 
      this.totalMSPR+=element['mspr']
      this.positiveMSPR+=Math.max(element['mspr'],0)
      this.negativeMSPR+=Math.min(element['mspr'],0)
      this.totalChange+=element['change']
      this.positiveChange+=Math.max(element['change'],0)
      this.negativeChange+=Math.min(element['change'],0)
    });

    this.totalMSPR = parseFloat(this.totalMSPR.toFixed(2));
    this.positiveMSPR = parseFloat(this.positiveMSPR.toFixed(2))
    this.negativeMSPR = parseFloat(this.negativeMSPR.toFixed(2))
    this.totalChange = parseFloat(this.totalChange.toFixed(2))
    this.positiveChange = parseFloat(this.positiveChange.toFixed(2))
    this.negativeChange = parseFloat(this.negativeChange.toFixed(2))
  }

  ngOnChanges(){

  }

}
