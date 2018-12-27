import { Component, OnInit } from '@angular/core';
import { LogIn } from 'src/app/model/login.model';

import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { News } from 'src/app/model/news.model';
import { UploadService } from 'src/app/core/services/upload.service';
import { UserService } from 'src/app/core/services/user.service';
import { NewsService } from 'src/app/core/services/news.service';


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

pageTitle: string = "DOBRO DOSO KORISNIKU!!1!1"

  login : LogIn;
  usernameInvalid : boolean;
  passwordInvalid : boolean;
  dataFlag : boolean;
  allNews: News[];

  private selectedFile: File;
  private imagePath: String;
  private image: Image;

  constructor(private http: HttpClient, private uploadService: UploadService, 
    private userService: UserService, private newsService: NewsService) {
    this.selectedFile = null;
    this.image = new Image("","");
   }

  ngOnInit() {
    this.login = new LogIn("", "");
    this.resetFlags();
    this.newsService.findAll().subscribe(
      result => {
        this.allNews = result;
        console.log(this.allNews);
      }
    )
  }

  tryLogin(): void{
    this.resetFlags();
    if(this.login.username == ""){
      this.usernameInvalid = true;
      this.dataFlag = true;
    }
    if(this.login.password == ""){
      this.passwordInvalid = true;
      this.dataFlag = true;
    }
    if(!this.dataFlag){
      this.userService.login(this.login).subscribe(
        user => {
           console.log("Jeeeeee"); 
        }
      );
    }

    
  }

  resetFlags(): void{
    this.usernameInvalid = false;
    this.passwordInvalid = false;
    this.dataFlag = false;
  }

  onFileSelected(event: { target: { files: File[]; }; }){
    this.selectedFile = event.target.files[0] as File;
  }

  onUpload(){
    const uploadData: FormData = new FormData();
    uploadData.append("image", this.selectedFile, this.selectedFile.name);
    //this.uploadService.uploadImage(uploadData);
    this.http.post("/api/image",uploadData,{responseType: "text"})
    .subscribe(
      res => {this.imagePath = res;},
      error => {console.log(error);});
  }

  onLoad(){
    this.http.get<Image>("api/image/" + this.imagePath).subscribe(
      res => {this.image = res;},
      error => {console.log(error);}
    );
  }
}

class Image {
  content: any;
  format: string;

  constructor(content:any, format:string){
    this.content = content;
    this.format = format;
  }
}