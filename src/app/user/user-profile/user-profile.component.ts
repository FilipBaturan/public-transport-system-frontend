import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/users/user.model';
import { UserService } from 'src/app/core/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Image } from 'src/app/model/util.model';
import { UploadService } from 'src/app/core/services/upload.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  user: User;
  password: string;
  verify: string;
  image: Image;
  imagePath: string;

  constructor(private userService: UserService, private toastr: ToastrService,
              private uploadService: UploadService) {
                this.image = {content: '', format: ''};
               }

  ngOnInit() {
    this.userService.getUser().subscribe(
      response => {
        this.user = response;
        this.userService.getImageFromUser(this.user.id).subscribe(
          image => {
            this.imagePath = image.image;
            console.log(this.user);
            this.uploadService.getImage(this.imagePath).subscribe(
              res => { this.image = res; },
              error => { console.log(error); }
            );
          }
        );
      },
      err => this.toastr.error('There was an error in showing this profile')
    );
  }

  saveChanges(): void {
    console.log(this.user);
    if (this.password !== undefined && this.password === this.verify) {
      this.user.password = this.password;
    } else if (this.password !== undefined && this.password !== this.verify) {
      this.toastr.warning('New password and verification are not the same!');
      return;
    }
    this.userService.update(this.user, ['modifyRegistered/' + this.user.id]).subscribe(
      response => {
        this.toastr.success('Successfully saved changes!');
      }
    );
  }

}
