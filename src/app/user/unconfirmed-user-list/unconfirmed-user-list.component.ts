import { Component, OnInit } from '@angular/core';
import { User } from '../../model/users/user.model';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-unconfirmed-user-list',
  templateUrl: './unconfirmed-user-list.component.html',
  styleUrls: ['./unconfirmed-user-list.component.css']
})
export class UnconfirmedUserListComponent implements OnInit {

  displayedColumns: string[] = ['firstName', 'lastName', 'userName', 'email','docs', 'accept', 'deny']
  unconfirmedUsers: User[];

  constructor(private userService: UserService, private toastr: ToastrService) { }

  ngOnInit() {

    this.unconfirmedUsers = [];

    this.userService.getUnconfirmedUsers().subscribe(
      response => {this.unconfirmedUsers = response; }
    )
  }

  acceptUser(user:User){
    this.userService.acceptUser(user).subscribe(
      response => {
        if (response.status != 200)
          this.toastr.error("There was a problem with accepting this users document");
        else
        {
          var index = this.unconfirmedUsers.indexOf(user);
          const copiedData =  this.unconfirmedUsers.slice();
          copiedData.splice(index, 1);
          this.unconfirmedUsers = copiedData;
        }
        this.toastr.info("Documents succesfully accepted!")
      },
      // => this.toastr.error("Could not accept user")
    )
  }

  denyUser(user: User){
    this.userService.denyUser(user).subscribe(
      response => {
        if (response.status != 200)
          this.toastr.error("There was a problem with denying this users document");
        else
        {
          var index = this.unconfirmedUsers.indexOf(user);
          const copiedData =  this.unconfirmedUsers.slice();
          copiedData.splice(index, 1);
          this.unconfirmedUsers = copiedData;
        }
        this.toastr.info("Documents succesfully denied!")
      },
      //err => this.toastr.error("Could not deny user")
    )
  }


}
