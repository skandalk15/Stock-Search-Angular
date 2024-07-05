import {ChangeDetectorRef, Component, Inject, Input, OnInit, SimpleChanges} from '@angular/core';
import {debounceTime} from "rxjs/operators";
import {Subject} from "rxjs";
import {TransactionModalComponent} from "../transaction-modal/transaction-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import { StateService } from 'src/app/state.service';
import { ApiCallService } from 'src/app/services/api-call.service';

@Component({
  selector: 'app-stock-details',
  templateUrl: './stock-details.component.html',
  styleUrls: ['./stock-details.component.css']
})
export class StockDetailsComponent implements OnInit {
  @Input() stockSearched: object;
  @Input() lsPortfolio;
  @Input() temp;
  public favourites: any;
  public portfolioList;
  public isFavourite: boolean = false;
  public dateToday = new Date().toISOString();
  public favTickerArray: any;
  public portfolioTickerArray = [];
  public minutes;
  public modalRef:any;
  private _success = new Subject<string>();
  private _success1 = new Subject<string>();
  selectedTab = 1;
  staticAlertClosed = false;
  successMessage = '';
  alertColor = '';
  alertColor1='';
  boughtMessage = '';
  private prevTicker = undefined;
  public moneyFromStorage:any;

  public changeSuccessMessage() {
    this.alertColor = "success";
    this._success.next(`${this.stockSearched['getDetails']['ticker']} added to Watchlist.`);
  }
  public changeRemoveMessage() {
    this.alertColor = "danger";
    this._success.next(`${this.stockSearched['getDetails']['ticker']} removed from Watchlist.`);
  }

  public changeBoughtMessage() {
    this.alertColor1 = "success";
    this._success1.next(`${this.stockSearched['getDetails']['ticker']} bought successfully.`);
  }
  public changeSoldMessage() {
    this.alertColor1 = "danger";
    this._success1.next(`${this.stockSearched['getDetails']['ticker']} sold successfully.`);
  }

  constructor(@Inject(NgbModal) private modalService: NgbModal,private cd: ChangeDetectorRef, private stateService: StateService, private apiCall: ApiCallService) { }

  async ngOnInit() {
    this.stateService.state$.next(this.stockSearched);
    this.moneyFromStorage = await this.apiCall.getBalance();

    setTimeout(() => this.staticAlertClosed = true, 20000);

    // Auto close alert.
    this._success.subscribe(message => this.successMessage = message);
    this._success.pipe(
      debounceTime(5000)
    ).subscribe(() => this.successMessage = '');

    this._success1.subscribe(message => this.boughtMessage = message);
    this._success1.pipe(
      debounceTime(5000)
    ).subscribe(() => this.boughtMessage = '');
  }

  async ngOnChanges(changes: SimpleChanges){
    this.dateToday = new Date().toISOString();
    if(this.modalService.hasOpenModals()){
      this.modalRef.componentInstance.rightNow = new Date().toISOString();
      this.modalRef.componentInstance.portfolioElement = this.stockSearched['getPrice'];
    }
    if(this.prevTicker != undefined && changes["last"] != undefined){
      if(changes["stockSearched"] != undefined){
        if(this.prevTicker == changes["stockSearched"]['getDetails']['ticker']){
          //  Do nothing
        }
        else{
          this.selectedTab = 0
          this.prevTicker = this.stockSearched['getDetails']['ticker'];
        }
      }
      else{
      //  Do nothing
      }
    }
    else if(this.prevTicker != undefined){
    //  Do nothing
    }
    else{
      this.selectedTab = 0
      this.prevTicker = this.stockSearched['getDetails']['ticker'];
      console.log("Changes Recorded!", this.stockSearched);
    }

    if(Object.keys(this.stockSearched).length > 1){
      console.log(Object.keys(this.stockSearched));
      console.log("Changes recorded are: ", changes);

      this.favourites = await this.apiCall.getWatchlist();
      this.favTickerArray = this.favourites.map(function(x) {
        return x.ticker;
      }) 
      if (this.favTickerArray.indexOf(this.stockSearched['getDetails']['ticker']) != -1) {
        this.isFavourite = true;
      } else {
        this.isFavourite = false;
      }


      //Check if stock is already bought or not
      this.checkPortfolio();
      
    }
    else{
      console.error("Cannot find element");
    }

 }

  async checkPortfolio(){
    this.portfolioList = await this.apiCall.getPortfolio();

    this.portfolioTickerArray = this.portfolioList.map(function(x) {
      return x.ticker;
    })
    let idx = this.portfolioTickerArray.indexOf(this.stockSearched['getDetails']['ticker']);
    if (idx != -1) {
      let ele = this.portfolioList.filter(item => item['ticker'] == this.stockSearched['getPrice']['ticker'])[0];
      this.stockSearched['getPrice']['qty'] = ele['qty'];
      this.stockSearched['getPrice']['totalAmount'] = ele['totalAmount'];
      this.stockSearched['getPrice']['avgPrice'] = parseFloat((ele['totalAmount'] / ele['qty'])?.toFixed(3));
    } else {
      this.stockSearched['getPrice']['qty'] = 0;
      this.stockSearched['getPrice']['totalAmount'] = 0;
      this.stockSearched['getPrice']['avgPrice'] = 0;
    }
  }

  async setWatchlist(add){
    if(add == true){
      this.favourites.push({"ticker": this.stockSearched['getPrice']['ticker'], "name": this.stockSearched['getDetails']['name']});
      await this.apiCall.updateWatchlist(JSON.stringify(this.favourites))
      this.isFavourite = true;
      this.changeSuccessMessage();
    }
    else{
      this.favourites = this.favourites.filter(item => item.ticker !== this.stockSearched['getPrice']['ticker']);
      await this.apiCall.updateWatchlist(JSON.stringify(this.favourites))
      this.isFavourite = false;
      this.changeRemoveMessage();
    }
  }

  setSelectedTab(ev){
    this.selectedTab = ev;
  }

  
  modifyPortfolio(data){
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

  async addToPortfolio(data){
    this.portfolioList = this.portfolioList.filter(item => item['ticker'] != data['ticker']);
    let newAmount = parseFloat((data['prevTotal'] + data['quantity'] * data['currentPrice'])?.toFixed(3));
    let newQty = data['quantity'] + data['prevQty'];
    let newElement = {'ticker': data['ticker'], 'name': data['name'], 'qty': newQty, 'totalAmount': newAmount};
    this.moneyFromStorage-=data['quantity']*data['currentPrice'];
    await this.apiCall.updateBalance(this.moneyFromStorage.toString());
    this.portfolioList.push(newElement);
    await this.apiCall.updatePortfolio(JSON.stringify(this.portfolioList))
    this.changeBoughtMessage();
    // this._success1.next(`${this.stockSearched['getDetails']['ticker']} bought successfully!`);
    this.checkPortfolio();
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
    this.moneyFromStorage+=data['quantity']*data['currentPrice'];
    await this.apiCall.updateBalance(this.moneyFromStorage.toString());
    await this.apiCall.updatePortfolio(JSON.stringify(this.portfolioList))

    this.changeSoldMessage();
    this.checkPortfolio();
    // Make API call to fetch
    // this.getDetails();
  }

  

  openFormModal($event, operationType) {
    $event.stopPropagation();
    this.modalRef = this.modalService.open(TransactionModalComponent);
    this.modalRef.componentInstance.portfolioElement = this.stockSearched['getPrice'];
    this.modalRef.componentInstance.operationType = operationType;
    this.modalRef.componentInstance.rightNow = new Date().toISOString();
    this.modalRef.result.then((result) => {
      result['operationType'] = operationType;
      result['ticker'] = this.stockSearched['getPrice']['ticker'];
      result['currentPrice'] = this.stockSearched['getPrice']['last'];
      result['prevQty'] = this.stockSearched['getPrice']['qty'];
      result['prevTotal'] = this.stockSearched['getPrice']['totalAmount'];
      result['prevAverageRate'] = this.stockSearched['getPrice']['avgPrice'];
      result['name'] = this.stockSearched['getDetails']['name'];
      this.modifyPortfolio(result);
    }).catch((error) => {
      console.log(error);
    });
  }
}
