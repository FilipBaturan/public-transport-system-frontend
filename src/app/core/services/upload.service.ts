import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private uploadURL = "/api/upload";

  constructor(private http: HttpClient) {
  }

  uploadImage(uploadData: FormData){
    this.http.post(this.uploadURL, uploadData, {responseType: "text"});
  }
}
