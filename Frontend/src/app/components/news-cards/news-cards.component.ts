import {Component, Inject, Input, OnInit} from '@angular/core';
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-news-cards',
  templateUrl: './news-cards.component.html',
  styleUrls: ['./news-cards.component.css']
})
export class NewsCardsComponent implements OnInit {
  @Input() cardData: any;
  twitterURL :string = "https://twitter.com/intent/tweet?text=";
  facebookURL :string = "https://www.facebook.com/sharer/sharer.php?u=";
  closeResult: string;

  constructor(@Inject(NgbModal) private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  ngOnChanges(): void{
    this.twitterURL += this.cardData.title + " " + this.cardData.url;
    this.facebookURL += this.cardData.url;
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }


}
