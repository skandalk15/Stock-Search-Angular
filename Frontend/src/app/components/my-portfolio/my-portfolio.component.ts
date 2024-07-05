import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TransactionModalComponent } from '../transaction-modal/transaction-modal.component';
import {Router} from "@angular/router";

@Component({
  selector: 'app-my-portfolio',
  templateUrl: './my-portfolio.component.html',
  styleUrls: ['./my-portfolio.component.css']
})
export class MyPortfolioComponent implements OnInit {

  @Input() portfolioElement: any;
  @Output("modifyPortfolio") modifyPortfolio: EventEmitter<any>= new EventEmitter<any>();

  constructor(private router: Router, @Inject(NgbModal) private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  sellStock(data: any){
    this.modifyPortfolio.emit(data);
  }

  openFormModal($event: any, operationType: any) {
    $event.stopPropagation();
    const modalRef = this.modalService.open(TransactionModalComponent);
    modalRef.componentInstance.portfolioElement = this.portfolioElement;
    modalRef.componentInstance.operationType = operationType;
    modalRef.result.then((result: any) => {
      result['operationType'] = operationType;
      result['ticker'] = this.portfolioElement['ticker'];
      result['currentPrice'] = this.portfolioElement['last'];
      result['prevQty'] = this.portfolioElement['qty'];
      result['prevTotal'] = this.portfolioElement['totalAmount'];
      result['prevAverageRate'] = this.portfolioElement['avgPrice'];
      result['name'] = this.portfolioElement['name'];
      this.sellStock(result);
    }).catch((error: any) => {
      console.log(error);
    });
  }

  navigateToDetailsPage(ticker: any) {
    this.router.navigateByUrl('/details/'+ticker);
  }

}
