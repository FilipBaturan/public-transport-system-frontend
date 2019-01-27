import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/users/user.model';
import { UserService } from 'src/app/core/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  user: User;
  password: string;
  verify: string;

  constructor(private userService: UserService, private toastr: ToastrService) { }

  ngOnInit() {
    this.userService.getUser().subscribe(
      response => {
        this.user = response;
      },
      err => this.toastr.error("There was an error in showing this profile")
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
