import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-summary-tab',
  templateUrl: './summary-tab.component.html',
  styleUrls: ['./summary-tab.component.css']
})
export class SummaryTabComponent implements OnInit {

  @Input() stockSearched: object;

  constructor(private router: Router) { }

  ngOnInit(): void {
    
  }

  navigateToDetailsPage(ticker) {
    this.router.navigateByUrl('/search/'+ticker);
  }

}
