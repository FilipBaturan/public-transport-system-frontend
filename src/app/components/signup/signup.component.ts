import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/users/user.model';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  user: User;
  nameInvalid : boolean;
  lastNameInvalid : boolean;
  usernameInvalid : boolean;
  passwordInvalid : boolean;
  emailInvalid : boolean;
  phoneInvalid : boolean;
  dataFlag : boolean;
  

  constructor(private router: Router,
              private userService: UserService) { }

  ngOnInit() {
    this.user = new User(0, "", "", "", "", "", true, "");
    this.resetFlags();
  }

  tryRegister(): void {
    this.resetFlags();
    if(this.user.firstName == ""){
      this.nameInvalid = true;
      this.dataFlag = true;
    }
    if(this.user.lastName == ""){
      this.lastNameInvalid = true;
      this.dataFlag = true;
    }
    if(this.user.username == ""){
      this.usernameInvalid = true;
      this.dataFlag = true;
    }
    if(this.user.password == ""){
      this.passwordInvalid = true;
      this.dataFlag = true;
    }
    if(this.user.email == ""){
      this.emailInvalid = true;
      this.dataFlag = true;
    }
    if(this.user.telephone == ""){
      this.phoneInvalid = true;
      this.dataFlag = true;
    }
    if(!this.dataFlag){
      this.userService.create(this.user, "add").subscribe(
        response => {
          this.router.navigate(['/welcome']);
        }
      );
    }
  }

  resetFlags(): void{
    this.nameInvalid = false;
    this.lastNameInvalid = false;
    this.usernameInvalid = false;
    this.passwordInvalid = false;
    this.emailInvalid = false;
    this.phoneInvalid = false;
    this.dataFlag = false;
  }

}
