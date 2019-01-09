import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { User } from '../../model/users/user.model';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/core/services/user.service';
import { MatTable } from '@angular/material';


@Component({
  selector: 'app-validator-list',
  templateUrl: './validator-list.component.html',
  styleUrls: ['./validator-list.component.css']
})
export class ValidatorListComponent implements OnInit {

  displayedColumns: string[] = ['firstName', 'lastName', 'userName', 'email', 'change', 'delete']

  dataSource : any[];

  validators: User[] = [];
  noUsers: boolean;
  
  //Ruganje gore (mock up)
  newUser: User;

  formShowed: boolean;

  @ViewChild(MatTable) table: MatTable<any>;

  constructor(private userService: UserService, private toastr: ToastrService,
    private changeDetectorRefs: ChangeDetectorRef) { }

  ngOnInit() {

    //ruganje gore
    this.newUser = new User(null, "new User Name", "new Pass", "new Name", "new Last Name",
     "new Email",  true, "123123");

    this.formShowed = false;

    this.userService.getValidators().subscribe(
      response => {this.validators = response; 
        this.checkUsersLength();
      }
    )
  }

  showForm()
  {
    this.formShowed = true;
  }

  showChangeForm(user: User)
  {
    this.newUser = user;
    this.showForm();
  }

  blockValidator(user:User)
  {
    if (user.id == null)
      this.toastr.warning("Please refresh the page to block this validator!");
    else
    {
      user.active = false;
      this.userService.updateValidator(user).subscribe(
        response => {
          if (response == null)
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
    
  }

  addValidator(){

    // updating validator
    if (this.newUser.id != null)
    {
      this.userService.updateValidator(this.newUser).subscribe(
        response => {
          if (response == null)
            this.toastr.error("There was a problem with updating the validator");
          else
          {
            this.toastr.info("Validator succesfully updated!");
            this.formShowed = false;
            this.newUser = new User(null, "new User Name", "new Pass", "new Name", "new Last Name",
            "new Email",  true, "123123");
          }
        }
      )
    }
    // adding new validator
    else
    {
      this.userService.addValidator(this.newUser).subscribe(
        response => {
          if (response == null)
            this.toastr.info("There was a problem with adding the validator");
          else
          {
            this.userService.getByUsername(this.newUser.username).subscribe(
              response => {
                if (response != null)
                {
                  this.newUser = response;
                  this.validators.push(this.newUser);
                  this.newUser = new User(null, "new User Name", "new Pass", "new Name", "new Last Name",
                  "new Email",  true, "123123");
                  this.table.renderRows();
                  this.toastr.info("Validator succesfully added!")
                }
              })
            
           
          }
          
          this.checkUsersLength();
        }
      )
  
      this.formShowed = false;
    }

  }


  checkUsersLength(){
    if (this.validators.length == 0)
      this.noUsers = true;
    else
      this.noUsers = false;
  }

}
