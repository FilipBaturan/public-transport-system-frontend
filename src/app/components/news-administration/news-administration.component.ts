import { Component, OnInit } from '@angular/core';
import { NewsService } from 'src/app/core/services/news.service';
import { News, NewsToAdd } from 'src/app/model/news.model';

@Component({
  selector: 'app-news-administration',
  templateUrl: './news-administration.component.html',
  styleUrls: ['./news-administration.component.css']
})
export class NewsAdministrationComponent implements OnInit {

  title: string;
  content: string;
  news: NewsToAdd;

  constructor(private newsService: NewsService) { }

  ngOnInit() {
    this.title = "";
    this.content = "";
  }
  
  addNews(): void{
    this.news = new NewsToAdd(this.title, this.content, 1);
    this.newsService.saveNews(this.news).subscribe(
      result => {
        console.log("Jeeeeee");
      }
    )
  }


}
