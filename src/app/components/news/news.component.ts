import { Component, OnInit, Input } from '@angular/core';
import { News } from 'src/app/model/news.model';
import { NewsService } from 'src/app/core/services/news.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  allNews: News[];

  constructor(private newsService: NewsService) { }

  ngOnInit() {
    this.newsService.findAll().subscribe(
      result => {
        this.allNews = result;
      }
    );
  }
}
