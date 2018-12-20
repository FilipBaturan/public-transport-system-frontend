import { Component, OnInit } from '@angular/core';
import { UploadService } from 'src/app/services/upload.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

pageTitle: string = "DOBRO DOSO KORISNIKU!!1!1"

  private selectedFile: File;
  private imagePath: String;
  private image: Image;

  constructor(private http: HttpClient, private uploadService: UploadService) {
    this.selectedFile = null;
    this.image = new Image("","");
   }

  ngOnInit() {
  }

  onFileSelected(event){
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