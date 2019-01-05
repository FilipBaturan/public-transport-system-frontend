import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  
  public mapCollapsed = true;
  public accCollapsed = true; 

  constructor() { }

  ngOnInit() {
  }

}
