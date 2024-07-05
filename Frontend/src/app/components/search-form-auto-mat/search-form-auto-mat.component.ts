import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from "@angular/router";
import {FormBuilder, FormGroup} from '@angular/forms';
import {switchMap, debounceTime, tap, finalize, filter, distinctUntilChanged, startWith} from 'rxjs/operators';
import {ApiCallService} from "../../services/api-call.service";
import { StateService } from 'src/app/state.service';
import { Subject } from 'rxjs';
import {ActivatedRoute} from "@angular/router";



@Component({
  selector: 'app-search-form-auto-mat',
  templateUrl: './search-form-auto-mat.component.html',
  styleUrls: ['./search-form-auto-mat.component.css']
})
export class SearchFormAutoMatComponent implements OnInit {
  @Output() ticker = new EventEmitter<string>();
  public info: string = '';
  public keyError: boolean = false;
  public keyErrorReason: string = "Please enter a valid ticker";
  public filteredTickers = [];
  public stocksForm: FormGroup;
  public isLoading = false;
  curTicker:any;

  boughtMessage = '';
  private _success1 = new Subject<string>();

  constructor(private router: Router, private fb: FormBuilder, private apiCall: ApiCallService,  private stateService: StateService, private route: ActivatedRoute) { }


  set_Data(name: string): void {
    this.info = name;
  }

  onSubmit(): void {
    if(this.stocksForm.get('userInput').value){
      this.info = this.stocksForm.get('userInput').value;
      this.ticker.emit(null);
      if (this.stocksForm.get('userInput').value != undefined) {
        if (this.stocksForm.get('userInput').value.trim() != '') {
          this.keyError = false;
          // this.stocksForm.get('userInput').setValue(this.info);
          this.info = this.info.toUpperCase();
          this.navigateToDetailsPage(this.info);
        } else {
          this.keyError = true;
          this._success1.next(this.keyErrorReason);
          console.log("KEY ERROR");
        }
      } else {
        this.keyError = true;
        this._success1.next(this.keyErrorReason);
        console.log("KEY ERROR");
      }
    } else {
      this.keyError = true;
      this._success1.next(this.keyErrorReason);
      console.log("KEY ERROR");
    }


  }

  clear_all(): void {
    this.keyError = false;
    this.info = "";
    this.filteredTickers = [];
    this.ticker.emit(this.info);
  }

  navigateToDetailsPage(ticker) {
    this.router.navigateByUrl('/search/'+ticker);
  }

  clearState(){
    this.filteredTickers = [];
    this.stateService.state$.next({});
    this.stocksForm.reset();
    this.stocksForm
      .get('userInput')
      .valueChanges
      .pipe(
        filter(res => {
          if(res){
            return res !== null && res.length >= 1
          } else {
            return false
          }
        }),
        distinctUntilChanged(),
        debounceTime(100),
        tap(() => this.isLoading = true),
        switchMap(value => this.apiCall.autocomplete(value.toUpperCase())
          .pipe(
            finalize(() => this.isLoading = false),
          )
        )
      )
      .subscribe(users => {
        this.filteredTickers = users.filter(element => !(element['symbol'].includes('.'))).filter(element=>element.type=="Common Stock")
      });
  }


  ngOnInit(): void {
    // this.stocksForm = this.fb.group({
    //   userInput: null
    // })
    this.route.paramMap.subscribe(params => {
      if (params.get("ticker") != "home") {
        this.stocksForm = this.fb.group({
          userInput: params.get("ticker")
        })
      } else {
        this.stocksForm = this.fb.group({
          userInput: null
        })
      }
    })

    this.stocksForm
      .get('userInput')
      .valueChanges
      .pipe(
        filter(res => {
          if(res){
            return res !== null && res.length >= 1
          } else {
            return false
          }
        }),
        distinctUntilChanged(),
        debounceTime(100),
        tap(() => this.isLoading = true),
        switchMap(value => this.apiCall.autocomplete(value.toUpperCase())
          .pipe(
            finalize(() => this.isLoading = false),
          )
        )
      )
      .subscribe(users => {
        this.filteredTickers = users.filter(element => !(element['symbol'].includes('.'))).filter(element=>element.type=="Common Stock")
      });

      this._success1.subscribe(message => this.boughtMessage = message);
    this._success1.pipe(
      debounceTime(5000)
    ).subscribe(() => this.boughtMessage = '');
  }

  displayFn(user) {
    if (user) { return user; }
  }

}
