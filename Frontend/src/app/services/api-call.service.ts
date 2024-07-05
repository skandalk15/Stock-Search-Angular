import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
// import {stringify} from "querystring";
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiCallService {
  apiURL: string = '/apis/stocks';
  // apiURL: string = 'http://localhost:8080/apis/stocks';
  urlCall: string = '';
  constructor(private httpClient: HttpClient) { }

  getPrice(ticker: string){
    this.urlCall = `${this.apiURL}/quotes?ticker=${ticker}`;
    return this.httpClient.get<any>(this.urlCall);
  }

  getDetails(ticker: string){
    this.urlCall = `${this.apiURL}/overview?ticker=${ticker}`;
    return this.httpClient.get<any>(this.urlCall);
  }

  getNews(ticker: string){
    this.urlCall = `${this.apiURL}/news/?ticker=${ticker}`;
    return this.httpClient.get<any>(this.urlCall);
  }

  getHistory(ticker: string){
    this.urlCall = `${this.apiURL}/history?ticker=${ticker}`;
    return this.httpClient.get<any>(this.urlCall);
  }

  getLastChart(ticker: string, timestamp: string){
    console.log(ticker, timestamp);
    this.urlCall = `${this.apiURL}/lastChartPrices?ticker=${ticker}&timestamp=${timestamp}`;
    // this.urlCall = `http://127.0.0.1:8080/apis/stocks/lastChartPrices?ticker=${ticker}`;
    return this.httpClient.get<any>(this.urlCall);
  }

  async getBalance() {
    this.urlCall = `${this.apiURL}/wallet/balance`;
    // this.urlCall = `http://127.0.0.1:8080/apis/stocks/lastChartPrices?ticker=${ticker}`;
    return await firstValueFrom(this.httpClient.get<any>(this.urlCall));
  }

  async getPortfolio() {
    this.urlCall = `${this.apiURL}/portfolio`;
    // this.urlCall = `http://127.0.0.1:8080/apis/stocks/lastChartPrices?ticker=${ticker}`;
    return await firstValueFrom(this.httpClient.get<any>(this.urlCall))
  }

  async getWatchlist() {
    this.urlCall = `${this.apiURL}/watchlist`;
    // this.urlCall = `http://127.0.0.1:8080/apis/stocks/lastChartPrices?ticker=${ticker}`;
    return await firstValueFrom(this.httpClient.get<any>(this.urlCall))
  }

  async updateBalance(money: string) {
    this.urlCall = `${this.apiURL}/wallet/updateBalance`;
    // this.urlCall = `http://127.0.0.1:8080/apis/stocks/lastChartPrices?ticker=${ticker}`;
    return await firstValueFrom(this.httpClient.post<any>(this.urlCall, {"money": money}))
  }

  async updatePortfolio(portfolio: string) {
    this.urlCall = `${this.apiURL}/updatePortfolio`;
    // this.urlCall = `http://127.0.0.1:8080/apis/stocks/lastChartPrices?ticker=${ticker}`;
    return await firstValueFrom(this.httpClient.post<any>(this.urlCall, {"portfolio": portfolio}))
  }
  
  async updateWatchlist(watchlist: string) {
    this.urlCall = `${this.apiURL}/updateWatchlist`;
    // this.urlCall = `http://127.0.0.1:8080/apis/stocks/lastChartPrices?ticker=${ticker}`;
    return await firstValueFrom(this.httpClient.post<any>(this.urlCall, {"watchlist": watchlist}))
  }

  autocomplete(query: string){
    this.urlCall = `${this.apiURL}/autocomplete?query=${query}`;
    return this.httpClient.get<any>(this.urlCall);
  }

  companypeers(ticker: string){
    this.urlCall = `${this.apiURL}/companypeers?ticker=${ticker}`;
    return this.httpClient.get<any>(this.urlCall);
  }

  sentiment(ticker: string){
    this.urlCall = `${this.apiURL}/sentiment?ticker=${ticker}`;
    return this.httpClient.get<any>(this.urlCall);
  }

  recommendation(ticker: string){
    this.urlCall = `${this.apiURL}/recommendation?ticker=${ticker}`;
    return this.httpClient.get<any>(this.urlCall);
  }

  earnings(ticker: string){
    this.urlCall = `${this.apiURL}/companyearning?ticker=${ticker}`;
    return this.httpClient.get<any>(this.urlCall);
  }

  
}
