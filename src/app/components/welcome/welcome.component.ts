import { Component, OnInit } from '@angular/core';
import { LogIn } from 'src/app/model/login.model';
import { HttpClient } from '@angular/common/http';

import { News } from 'src/app/model/news.model';
import { UploadService } from 'src/app/core/services/upload.service';
import { UserService } from 'src/app/core/services/user.service';
import { NewsService } from 'src/app/core/services/news.service';
import { Image } from 'src/app/model/util.model';


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  login: LogIn;
  usernameInvalid: boolean;
  passwordInvalid: boolean;
  dataFlag: boolean;

  constructor(private http: HttpClient, private userService: UserService,
              private newsService: NewsService) {
   }

  ngOnInit() {
    this.login = {username: '', password: ''};
  }

    tryLogin(): void {
    this.resetFlags();
    if (this.login.username === '') {
      this.usernameInvalid = true;
      this.dataFlag = true;
    }
    if (this.login.password === '') {
      this.passwordInvalid = true;
      this.dataFlag = true;
    }
    if (!this.dataFlag) {
      this.userService.login(this.login).subscribe(
        user => { }
      );
    }
  }

  resetFlags(): void {
    this.usernameInvalid = false;
    this.passwordInvalid = false;
    this.dataFlag = false;
  }
}
