import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../model/user.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-unconfirmed-user-list',
  templateUrl: './unconfirmed-user-list.component.html',
  styleUrls: ['./unconfirmed-user-list.component.css']
})
export class UnconfirmedUserListComponent implements OnInit {

  unconfirmedUsers: User[];
  noUsers: boolean;

  constructor(private userService: UserService, private toastr: ToastrService) { }

  ngOnInit() {

    this.userService.getUnconfirmedUsers().subscribe(
      response => {this.unconfirmedUsers = response; 
        this.checkUsersLength();
      }
    )
  }

  acceptUser(user:User){
    this.userService.acceptUser(user).subscribe(
      response => {
        if (response == false)
          this.toastr.info("There was a problem with accepting this users document");
        else
        {
          var index = this.unconfirmedUsers.indexOf(user);
          this.unconfirmedUsers.splice(index, 1);
        }
        this.toastr.info("Documents succesfully accepted!")
        this.checkUsersLength();
      }
    )
  }

  denyUser(user: User){
    this.userService.denyUser(user).subscribe(
      response => {
        if (response == false)
        this.toastr.info("There was a problem with denying this users document");
        else
        {
          var index = this.unconfirmedUsers.indexOf(user);
          this.unconfirmedUsers.splice(index, 1);
        }
        this.toastr.info("Documents succesfully denied!")
        this.checkUsersLength();
      }
    )
  }

  checkUsersLength(){
    if (this.unconfirmedUsers.length == 0)
      this.noUsers = true;
    else
      this.noUsers = false;
  }

}
