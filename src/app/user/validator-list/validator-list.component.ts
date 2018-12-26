import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { User } from '../../model/users/user.model';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/core/services/user.service';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-validator-list',
  templateUrl: './validator-list.component.html',
  styleUrls: ['./validator-list.component.css']
})
export class ValidatorListComponent implements OnInit {

  displayedColumns: string[] = ['firstName', 'lastName', 'userName', 'email','docs', 'change', 'delete']

  dataSource : any[];

  validators: User[] = [];
  noUsers: boolean;
  
  //Ruganje gore (mock up)
  newUser: User;
  changedUser: User;

  changeFormShowed: boolean;

  constructor(private userService: UserService, private toastr: ToastrService,
    private changeDetectorRefs: ChangeDetectorRef) { }

  
  

  ngOnInit() {

    //ruganje gore
    this.newUser = new User(null, "newUserName", "newPass", "newName", "newLastName", "newEmail", 
                    true, "123123");


    this.changeFormShowed = false;

    this.userService.getValidators().subscribe(
      response => {this.validators = response; 
        this.checkUsersLength();
      }
    )
  }

  showChangeForm(user:User)
  {
    this.toastr.info("Show form!");
  }

  blockValidator(user:User)
  {
    user.active = false;
    this.userService.blockValidator(user).subscribe(
      response => {
        if (response == false)
          this.toastr.info("There was a problem with blocking the validator");
        else
        {
          var index = this.validators.indexOf(user);
          const copiedData =  this.validators.slice();
          copiedData.splice(index, 1);
          this.validators = copiedData;
         
          this.toastr.info("Validator succesfully blocked!")
        }
        
        this.checkUsersLength();
          
      }
    )
    this.changeDetectorRefs.detectChanges();
  }

  addValidator(){

    //opet ruganje gore

    this.userService.addValidator(this.newUser).subscribe(
      response => {
        if (response == false)
          this.toastr.info("There was a problem with adding the validator");
        else
        {
          this.validators.push(this.newUser);
          this.toastr.info("Validator succesfully added!")
        }
        
        this.checkUsersLength();
      }
    )
  }


  checkUsersLength(){
    if (this.validators.length == 0)
      this.noUsers = true;
    else
      this.noUsers = false;
  }

}
