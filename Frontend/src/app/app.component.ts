import {Component, NgModule} from '@angular/core';
// import {searchForm} from './components/search-form';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title: string = 'My Frontend';
  public ticker: string = '';

  setTicker(ticker: string){
    this.ticker = ticker;
  }
  ngOnInit(){
    // let favourite = ["AAPL", "GOOG"]
  }
}
