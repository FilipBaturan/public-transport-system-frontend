import { Component, OnInit } from '@angular/core';
import { NewsService } from 'src/app/core/services/news.service';
import { News, NewsToAdd } from 'src/app/model/news.model';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-news-administration',
  templateUrl: './news-administration.component.html',
  styleUrls: ['./news-administration.component.css']
})
export class NewsAdministrationComponent implements OnInit {

  allNews: News[];
  title: string;
  content: string;
  news: NewsToAdd;
  modification: boolean;
  changeNews: News;
  modifyTitle: string;
  modifyContent: string;
  operator: number;

  constructor(private newsService: NewsService, private toastr: ToastrService,
              private router: Router, private userService: AuthService) { }

  ngOnInit() {
    this.modification = false;
    this.title = '';
    this.content = '';
    this.newsService.findAll().subscribe(
      response => {
        this.allNews = response;
        this.userService.getCurrentUser().subscribe(
          user => {
            this.operator = user.id;
          }
        );
      },
      err => {this.toastr.error('Something went wrong...'); }
    );
  }

  addNews(): void {
    this.news = {title: this.title, content: this.content, operator: this.operator};
    this.newsService.saveNews(this.news).subscribe(
      result => {
        this.title = '';
        this.content = '';
        this.toastr.success('Successfully added news');
        this.refreshNews();
      }
    );
  }

  deleteNews(id: number): void {
    this.newsService.remove(id).subscribe(
      response => {
        this.toastr.success(response as string);
        this.refreshNews();
      }
    );
  }

  modifyNews(id: number): void {
    for (let i = 0; i < this.allNews.length; i++) {
      if (this.allNews[i].id === id) {
        this.changeNews = this.allNews[i];
        this.modifyTitle = this.changeNews.title;
        this.modifyContent = this.changeNews.content;
        this.modification = true;
        return;
       }
     }
  }

  saveChanges(): void {
    this.changeNews.title = this.modifyTitle;
    this.changeNews.content = this.modifyContent;
    console.log(this.changeNews);
    this.newsService.update(this.changeNews, this.changeNews.id).subscribe(
      response => {
        this.modification = false;
        this.toastr.success('Successfully modified news.');
        this.refreshNews();
      }
    );
  }

  refreshNews(): void {
    this.newsService.findAll().subscribe(
      response => {
        this.allNews = response;
      }
    );
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

}
