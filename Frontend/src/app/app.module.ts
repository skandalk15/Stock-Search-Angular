import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
// import { ChartModule } from 'angular-highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {NgbAlertModule, NgbModule} from "@ng-bootstrap/ng-bootstrap";


import { AppComponent } from './app.component';
import { SearchFormComponent } from './components/search-form/search-form.component';
import { StockDetailsComponent } from './components/stock-details/stock-details.component';
import { StockChartComponent } from './components/stock-chart/stock-chart.component';
import { AlertsComponent } from './components/alerts/alerts.component';
import { NewsCardHolderComponent } from './components/news-card-holder/news-card-holder.component';
import { NewsCardsComponent } from './components/news-cards/news-cards.component';
import { StockDetailsWrapperComponent } from './components/stock-details-wrapper/stock-details-wrapper.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { WatchlistWrapperComponent } from './components/watchlist-wrapper/watchlist-wrapper.component';
import { TempChartComponent } from './components/temp-chart/temp-chart.component';
import { SummaryTabComponent } from './components/summary-tab/summary-tab.component';
import { WatchlistCardsComponent } from './components/watchlist-cards/watchlist-cards.component';
import {SearchFormAutoMatComponent} from "./components/search-form-auto-mat/search-form-auto-mat.component";
import { StockChartOhlcComponent } from './components/stock-chart-ohlc/stock-chart-ohlc.component';
import { MyPortfolioWrapperComponent } from './components/my-portfolio-wrapper/my-portfolio-wrapper.component';
import { MyPortfolioComponent } from './components/my-portfolio/my-portfolio.component';
import { TransactionModalComponent } from './components/transaction-modal/transaction-modal.component';
import { InsightsComponent } from './insights/insights.component';
import { RecommendationChartComponent } from './recommendation-chart/recommendation-chart.component';
import { EarningsChartComponent } from './earnings-chart/earnings-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchFormComponent,
    SearchFormAutoMatComponent,
    StockDetailsComponent,
    StockChartComponent,
    AlertsComponent,
    NewsCardHolderComponent,
    NewsCardsComponent,
    StockDetailsWrapperComponent,
    NavbarComponent,
    FooterComponent,
    WatchlistWrapperComponent,
    TempChartComponent,
    SummaryTabComponent,
    WatchlistCardsComponent,
    StockChartOhlcComponent,
    MyPortfolioWrapperComponent,
    MyPortfolioComponent,
    TransactionModalComponent,
    InsightsComponent,
    RecommendationChartComponent,
    EarningsChartComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HighchartsChartModule,
    RouterModule.forRoot([
      {path: "search/:ticker", component: StockDetailsWrapperComponent},
      // {path: "search", component: StockDetailsWrapperComponent},
      {path: "watchlist", pathMatch: "full", component: WatchlistWrapperComponent},
      {path: "", redirectTo: "search/home", pathMatch: "full"},
      {path: "portfolio", pathMatch: "full", component: MyPortfolioWrapperComponent}
    ]),
    ReactiveFormsModule,
    MatAutocompleteModule,
    NgbAlertModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
