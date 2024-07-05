import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from "@angular/router";
import {ActivatedRoute} from "@angular/router";
import { StateService } from 'src/app/state.service';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.css']
})
export class SearchFormComponent implements OnInit {
  @Output() ticker = new EventEmitter<string>();
  public info: string = '';
  public keyError: boolean = false;
  public keyErrorReason: string = "Please enter valid Ticker.";

  set_Data(name: string): void {
    this.info = name;
  }

  onSubmit(data: NgForm): void {
    this.info = data.value.keywords;
    // tslint:disable-next-line:triple-equals
    this.ticker.emit(null);
    if (data.value.keywords != undefined && data.value.keywords != null) {
      if (data.value.keywords.trim() != '') {
        this.keyError = false;
        this.navigateToDetailsPage(this.info);
      } else {
        this.keyError = true;
      }
      //  Check with autocomplete regarding valid ticker.
    } else {
      this.keyError = true;
    }

  }

  clear_all(): void {
    this.keyError = false;
    this.info = "";
    this.ticker.emit(this.info);
  }

  clearState(){
     this.stateService.state$.next({});
  }

  navigateToDetailsPage(ticker) {
    this.router.navigateByUrl('/details/'+ticker);
  }

  constructor(private router: Router, private stateService: StateService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.ticker.emit(params.get("ticker"));
    })
  }
}
