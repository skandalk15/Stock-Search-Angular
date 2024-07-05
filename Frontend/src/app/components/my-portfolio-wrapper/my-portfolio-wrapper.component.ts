import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {debounceTime} from "rxjs/operators";
import {Subject} from "rxjs";
import {ApiCallService} from "../../services/api-call.service";

@Component({
  selector: 'app-my-portfolio-wrapper',
  templateUrl: './my-portfolio-wrapper.component.html'
  // styleUrls: ['./my-portfolio-wrapper.component.css']
})
export class MyPortfolioWrapperComponent implements OnInit {

  public portfolioList: any;
  public allTickers: string;
  // public stockData: object = undefined;
  public stockData: any[] = [];
  public noPortfolioAlert = true;
  public moneyFromStorage: any;
  alertColor1='';
  boughtMessage = '';
  private _success1 = new Subject<string>();
  boughtTicker ='';
  public isPresent = false;

  public changeBoughtMessage() {
    this.alertColor1 = "success";
    this._success1.next(`${this.boughtTicker} bought successfully.`);
  }
  public changeSoldMessage() {
    this.alertColor1 = "danger";
    this._success1.next(`${this.boughtTicker} sold successfully.`);
  }


  constructor(private router: Router, private apiCall: ApiCallService) {
  }


  async ngOnInit() {
    this.portfolioList = await this.apiCall.getPortfolio();
    this.moneyFromStorage = await this.apiCall.getBalance()
    if (this.portfolioList.length != 0) {
      this.portfolioList = this.portfolioList.sort();
      this.allTickers = "";
      for(let i = 0; i < this.portfolioList.length - 1; i++){
        this.allTickers += this.portfolioList[i].ticker + ',';
      }
      this.allTickers += this.portfolioList[this.portfolioList.length - 1].ticker;
      this.getDetails();
      this.noPortfolioAlert = false;

    }
    else{
      this.portfolioList = [];
      this.noPortfolioAlert = true;

    }
    
    this.isPresent = true;
    
    this._success1.subscribe(message => this.boughtMessage = message);
    this._success1.pipe(
      debounceTime(5000)
    ).subscribe(() => this.boughtMessage = '');

  }

  modifyPortfolio(data: any){
    if(data.operationType == "Buy"){
      console.log("Buy Function called");
      this.addToPortfolio(data);
    }
    else if(data.operationType == "Sell"){
      console.log("Sell Function called");
      this.removeFromPortfolio(data);
    }
    else{
      console.log("Error")
    }
  }

  async addToPortfolio(data: any){
    this.portfolioList = this.portfolioList.filter(item => item['ticker'] != data['ticker']);
    let newAmount = parseFloat((data['prevTotal'] + data['quantity'] * data['currentPrice'])?.toFixed(3));
    let newQty = data['quantity'] + data['prevQty'];
    this.boughtTicker=data['ticker'];
    let newElement = {'ticker': data['ticker'], 'name': data['name'], 'qty': newQty, 'totalAmount': newAmount};
    this.portfolioList.push(newElement);
    this.moneyFromStorage-=data['quantity']*data['currentPrice'];
    await this.apiCall.updateBalance(this.moneyFromStorage.toString());
    await this.apiCall.updatePortfolio(JSON.stringify(this.portfolioList))
    this.changeBoughtMessage();
    this.getDetails();
  }


  
  async removeFromPortfolio(data){
    // partial selling
    this.portfolioList = this.portfolioList.filter(item => item['ticker'] != data.ticker);
    let newQty = data['prevQty'] - data['quantity'] ;
    let overallPL = parseFloat((data['quantity'] * data['currentPrice'])?.toFixed(3)) - parseFloat((data['quantity'] * data['prevAverageRate'])?.toFixed(3));
    if(newQty > 0){
      let newAmount = parseFloat((data['prevTotal'] - (data['quantity'] * data['prevAverageRate']))?.toFixed(3));
      let newElement = {'ticker': data['ticker'], 'name': data['name'], 'qty': newQty, 'totalAmount': newAmount};
      this.portfolioList.push(newElement);
    }
    else if(newQty == 0){
      console.log("All stocks are sold.");
      this.allTickers = "";
      for(let i = 0; i < this.portfolioList.length - 1; i++){
        this.allTickers += this.portfolioList[i].ticker + ',';
      }
      if(this.portfolioList.length > 0){
        this.allTickers += this.portfolioList[this.portfolioList.length - 1].ticker;
      }
      else{
        this.noPortfolioAlert = true;
      }
    }
    else{
      console.error("You cannot sell the stocks which you don not have");
      this.allTickers = "";
      for(let i = 0; i < this.portfolioList.length - 1; i++){
        this.allTickers += this.portfolioList[i].ticker + ',';
      }
      if(this.portfolioList.length > 0){
        this.allTickers += this.portfolioList[this.portfolioList.length - 1].ticker;
      }
      else{
        this.noPortfolioAlert = true;
      }
    }
    this.moneyFromStorage+=data['quantity']*data['currentPrice'];
    await this.apiCall.updateBalance(this.moneyFromStorage.toString());
    await this.apiCall.updatePortfolio(JSON.stringify(this.portfolioList))
    this.boughtTicker=data['ticker'];
    this.changeSoldMessage();

    // Make API call to fetch
    this.getDetails();
  }

  getDetails(){
    let temp = []
    // if(this.portfolioList != []){
    if(this.portfolioList.length != 0){
      this.portfolioList.forEach(element => {

        this.apiCall.getPrice(element.ticker).subscribe((data: any) => {
        // console.log(data.sort(function(a, b) {
        //     if (a.ticker < b.ticker) {
        //       return -1;
        //     }
        //     else{
        //       return 1;
        //     }
        //   }
        // ));
        
        // for(let i = 0; i< data.length; i++){
          let ele = this.portfolioList.filter(item => item.ticker == data[0]['ticker'])[0]
          data[0]['name'] = ele['name'];
          data[0]['qty'] = ele['qty'];
          data[0]['totalAmount'] = ele['totalAmount'];
          data[0]['avgPrice'] = parseFloat((data[0]['totalAmount']/data[0]['qty'])?.toFixed(3));
          data[0]['currentTotal'] = parseFloat((data[0]['last'] * data[0]['qty'])?.toFixed(3));
          data[0]['currentDifference'] = parseFloat((data[0]['last'] - data[0]['avgPrice'])?.toFixed(3));
          if(data[0]['currentDifference'] > 0){
            data[0]['colorElement'] = 'green';
          }
          else if(data[0]['currentDifference'] < 0){
            data[0]['colorElement'] = 'red';
          }
          else{
            data[0]['colorElement'] = 'black';
          }
          temp.push(data[0]);
        // }
        // this.stockData = temp;
      });
        
      });
      this.stockData = temp;
    }
    else{
      console.log("You don't have any stocks.");
      this.stockData = [];
      this.noPortfolioAlert = true;
    }
  }

}
