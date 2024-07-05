import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {ApiCallService} from "../../services/api-call.service";
import {ActivatedRoute} from "@angular/router";
import {interval, Subscription} from "rxjs";
import { StateService } from 'src/app/state.service';

@Component({
  selector: 'app-stock-details-wrapper',
  templateUrl: './stock-details-wrapper.component.html'
  // styleUrls: ['./stock-details-wrapper.component.css']
})
export class StockDetailsWrapperComponent implements OnInit {
  mySubscription: Subscription;
  public ticker: string;
  public stockSearched: object = undefined;
  public wrongTicker: boolean = false;
  public wrongTickerReason: string = "No data found. Please enter a valid Ticker";
  public loading: Boolean = true;
  curState:any;
  home:boolean;

  constructor(private apiCall: ApiCallService, private route: ActivatedRoute, private stateService: StateService) {
  }

  ngOnInit(): void {
    // this.state = this.stateService.state$.getValue() || {};
    this.route.paramMap.subscribe(params => {
      this.ticker = params.get('ticker');
      if (this.ticker != '' && this.ticker != undefined && this.ticker!='home') {

        this.home=false;
        

        this.loading = true;
        
        this.stockSearched = {'getPrice': {}, 'getDetails': {}};
        this.curState =this.stateService.state$.getValue() || {};
        if(Object.keys(this.curState).length!=0 && this.curState['getPrice']['ticker']==this.ticker){
          this.stockSearched = this.curState;
          this.loading=false;
        }
        else{
          console.log("makeAPIcall() called...")
          this.makeApiCallForSearchedItems();
        }
        // TODO enable this in prod.
        console.log("Market Open: ", this.stockSearched['getPrice']['marketOpen']);
        this.mySubscription = interval(15000).subscribe(x => {
          if(this.wrongTicker == false && this.stockSearched['getPrice']['marketOpen'] == true ){
            this.getLiveUpdate();
          }
          else{
            this.mySubscription.unsubscribe();
          }
        });


      }
      else{
        this.home=true;
      }

    })
    
  }

  ngOnDestroy(){
    this.wrongTicker = false;
    // TODO enable this in prod.
    if(this.mySubscription){
      this.mySubscription.unsubscribe();
    }
  }

  ngAfterViewInit(){
    console.log("LOADED")
  }

  allDataAvailable(){
    if(Object.keys(this.stockSearched).length == 9){
      return true;
    }
    else{
      return false;
    }
  }

  getColor(data){
    if(data[0]['change'] < 0){
      data[0]['color'] = "red";
    }
    else if(data[0]['change'] > 0){
      data[0]['color'] = "green";
    }
    else{
      data[0]['color'] = "black";
    }
    return data
  }

  getLiveUpdate(){
    this.apiCall.getPrice(this.ticker).subscribe((data: any[]) => {
      data = this.getColor(data);
      this.stockSearched['getPrice'] = data[0];
    });
    this.apiCall.getLastChart(this.ticker, this.stockSearched['getPrice']['humantimestamp']).subscribe((data: any[]) => {
      this.stockSearched['getLastChart'] = data;
    })
  }

  makeApiCallForSearchedItems() {
    let tempStock = {}
    this.apiCall.getDetails(this.ticker).subscribe((data: any[]) => {
      if (Object.keys(data).length<3) {
        this.wrongTicker = true;
        this.loading = false;
      } else {
        this.wrongTicker = false
        tempStock['getDetails'] = data;
        if (this.wrongTicker == false) {
          this.apiCall.getPrice(this.ticker).subscribe((data: any[]) => {
            // While searching for stored data, use another function.
            data = this.getColor(data);
            tempStock['getPrice'] = data[0];
            this.apiCall.getLastChart(this.ticker, data[0]['humantimestamp']).subscribe((chartData: any[]) => {
              console.log(chartData)
              tempStock['getLastChart'] = chartData;
            })
          });
          this.apiCall.getNews(this.ticker).subscribe((data: any[]) => {
            tempStock['getNews'] = data;
          })
          this.apiCall.getHistory(this.ticker).subscribe((data: any[]) => {
            tempStock['getHistory'] = data;
          })
          this.apiCall.companypeers(this.ticker).subscribe((data: any[]) => {
            tempStock['getPeers'] = data;
          })
          this.apiCall.sentiment(this.ticker).subscribe((data: any[]) => {
            tempStock['getSentiment'] = data;
          })
          this.apiCall.recommendation(this.ticker).subscribe((data: any[]) => {
            tempStock['getRecommendation'] = data;
          })
          this.apiCall.earnings(this.ticker).subscribe((data: any[]) => {
            tempStock['getEarnings'] = data;
          })
          
          this.stockSearched = tempStock;
          this.loading = false;
          // this.state = tempStock;
          // this.stateService.state$.next(tempStock);
        }
      }
    });
  }

}
