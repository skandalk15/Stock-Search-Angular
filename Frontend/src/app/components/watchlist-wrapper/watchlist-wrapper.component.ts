import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {ApiCallService} from "../../services/api-call.service";

@Component({
  selector: 'app-watchlist-wrapper',
  templateUrl: './watchlist-wrapper.component.html'
  // styleUrls: ['./watchlist-wrapper.component.css']
})
export class WatchlistWrapperComponent implements OnInit {
  public favourites: any;
  public allTickers: string;
  public stockData: any[];
  public emptyWatchlistAlert:boolean = true;
  public isPresent = false;

  constructor(private router: Router, private apiCall: ApiCallService) {
  }


  async ngOnInit() {
    this.favourites = await this.apiCall.getWatchlist();
    if(this.favourites.length != 0){
      this.emptyWatchlistAlert = false;
      this.favourites = this.favourites.sort();
      this.allTickers = "";
      for(let i = 0; i < this.favourites.length - 1; i++){
        this.allTickers += this.favourites[i].ticker + ',';
      }
      this.allTickers += this.favourites[this.favourites.length - 1].ticker;
      this.getDetails();
    }
    else{
      this.emptyWatchlistAlert = true;
      this.favourites = [];
    }
    this.isPresent = true;
  }

  navigateToDetailsPage(ticker) {
    this.router.navigateByUrl('/search/'+ticker);
  }

  async removeFromWatchlist(ticker){
      this.favourites = this.favourites.filter(item => item['ticker'] != ticker);
    await this.apiCall.updateWatchlist(JSON.stringify(this.favourites))
      this.allTickers = "";
      if(this.favourites.length > 0){
        for(let i = 0; i < this.favourites.length - 1; i++){
          this.allTickers += this.favourites[i].ticker + ',';
        }
        this.allTickers += this.favourites[this.favourites.length - 1].ticker;
        this.getDetails();
      }
      else{
        this.stockData = [];
        this.emptyWatchlistAlert = true;
      }
  }

  getColor(data){
    if(data['change'] < 0){
      data['color'] = "red";
    }
    else if(data['change'] > 0){
      data['color'] = "green";
    }
    else{
      data['color'] = "black";
    }
    return data
  }

  getDetails(){
    if(this.favourites.length != 0){
       let temp = []
       this.favourites.forEach(element=>{

        this.apiCall.getPrice(element.ticker).subscribe((data: any) => {
        // While searching for stored data, use another function.
        //     if (a.ticker < b.ticker) {
        //       return -1;
        //     }
        //     else{
        //       return 1;
        //     }
        //   }
        // ));
       
        // for(let i = 0; i< data.length; i++){
          data[0] = this.getColor(data[0]);
          data[0]['name'] = this.favourites.filter(item => item.ticker == data[0]['ticker'])[0]['name'];
          temp.push(data[0]);
        // }
        // this.stockData = temp;
      });

       })
      this.stockData = temp;
    }
    else{
      this.emptyWatchlistAlert = true;
    }
  }
}
