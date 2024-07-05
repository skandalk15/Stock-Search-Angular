import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { StateService } from 'src/app/state.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  state:any;
  ticker:any = '';
  constructor(private router: Router, private stateService: StateService) { }

   

  ngOnInit(): void {

     
    this.stateService.state$.subscribe(val => {
    this.state=val;
    if(this.state){
      if(Object.keys(this.state).length!=0){
        this.ticker = this.state['getPrice']['ticker'];
      }
      else{
        this.ticker='';
      }
    }
    })

  }

  navigated(){

  }

//   navigated(){
// console.log('a')
    
// }; 

//     if(Object.keys(this.state).length!=0){
//       this.ticker = this.state['getPrice']['ticker']
//     }

//   }

}
