import { Component, OnInit } from '@angular/core';
import { LogIn } from 'src/app/model/login.model';
import { UserService } from 'src/app/services/user.service';


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

  constructor(private userService: UserService) { 
  }

  ngOnInit() {
    this.login = new LogIn("", "");
    this.resetFlags();
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

}
