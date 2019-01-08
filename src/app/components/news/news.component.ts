import { Component, OnInit, Input } from '@angular/core';
import { News } from 'src/app/model/news.model';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  @Input() news: News;

  constructor() { }

  ngOnInit() {
  }
}
