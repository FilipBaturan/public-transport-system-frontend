import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

pageTitle: string = "DOBRO DOSO KORISNIKU!!1!1"

  constructor() { }

  ngOnInit() {
  }

}
