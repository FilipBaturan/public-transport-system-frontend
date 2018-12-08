import { Component, OnInit } from '@angular/core';
import { User } from '../../model/users/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-reg-user-list',
  templateUrl: './reg-user-list.component.html',
  styleUrls: ['./reg-user-list.component.css']
})
export class RegUserListComponent implements OnInit {

  registeredUsers: User[];
  noUsers: boolean = true;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.getRegUsers().subscribe(
      response => {this.registeredUsers = response; 
        this.checkUsersLength();
      }
    )
  }

  checkUsersLength(){
    if (this.registeredUsers.length == 0)
      this.noUsers = true;
    else
      this.noUsers = false;
  }

}
