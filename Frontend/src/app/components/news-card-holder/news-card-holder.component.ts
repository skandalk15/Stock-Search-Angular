import {Component, Input, OnInit, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-news-card-holder',
  templateUrl: './news-card-holder.component.html',
  styleUrls: ['./news-card-holder.component.css']
})
export class NewsCardHolderComponent implements OnInit {
  @Input() allNews: any;

  constructor() { }

  ngOnInit(): void {
  }

}
