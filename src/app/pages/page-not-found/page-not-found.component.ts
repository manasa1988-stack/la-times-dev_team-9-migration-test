import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html'
})
export class PageNotFoundComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    
  }

  ngAfterContentInit(){
    // window.location.assign('/404.aspx');
  }

}
