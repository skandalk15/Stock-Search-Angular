import {Component, Input, Inject, OnInit, SimpleChanges} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { ApiCallService } from 'src/app/services/api-call.service';

@Component({
  selector: 'app-transaction-modal',
  templateUrl: './transaction-modal.component.html'
  // styleUrls: ['./transaction-modal.component.css']
})
export class TransactionModalComponent implements OnInit {
  @Input() portfolioElement;
  @Input() operationType;
  @Input() rightNow;
  myForm: FormGroup;
  public money: any;
  stockError: boolean =false;
  moneyError:boolean=false;
  maxStock:any;

  constructor(@Inject(NgbActiveModal) public activeModal: NgbActiveModal,
              private formBuilder: FormBuilder,
              private apiCall: ApiCallService
  ) {
  }

  

  checkStockError(val){
    if(this.portfolioElement['qty']<val) this.stockError=true;
    else this.stockError=false;
  }

  checkMoneyError(val){
    if((this.money/this.portfolioElement['last'])<val) this.moneyError=true;
    else this.moneyError=false;
  }

  private createForm(portfolio) {
    if (this.operationType == 'Buy'){
      this.myForm = this.formBuilder.group({
        quantity: [0, [Validators.required, Validators.min(1), Validators.max(Math.floor(this.money /this.portfolioElement['last']))]]
      });
    }
    else{
      this.myForm = this.formBuilder.group({
        quantity: [0, [Validators.required, Validators.min(1), Validators.max(portfolio['qty'])]]
      });
    }
  }

  submitForm() {
    this.activeModal.close(this.myForm.value);
  }

  async ngOnInit() {
    this.money = await this.apiCall.getBalance();
    this.createForm(this.portfolioElement);
    this.maxStock = Math.floor(this.money /this.portfolioElement['last'])
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

}
