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
  
  //Ruganje gore (mock up)
  newUser: User;

  formShowed: boolean;
  addName: boolean;

  @ViewChild(MatTable) table: MatTable<any>;

  constructor(private userService: UserService, private toastr: ToastrService,
    private changeDetectorRefs: ChangeDetectorRef) { }

  ngOnInit() {

    //ruganje gore
    this.newUser = new User(null, "new User Name", "new Pass", "new Name", "new Last Name",
     "new Email",  true, "123123");

    this.formShowed = false;
    this.addName = true;

    this.userService.getValidators().subscribe(
      response => {this.validators = response; }
    )
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
            var index = this.validators.indexOf(user);
            const copiedData =  this.validators.slice();
            copiedData.splice(index, 1);
            this.validators = copiedData;
           
            this.toastr.info("Validator succesfully blocked!")
        },
        err => {
          if (err.status != 409)
            this.toastr.error("There was a problem with blocking the validator");
          else
            this.toastr.error("Validator with given id does not exist"); 
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
          this.toastr.info("Validator succesfully updated!");
          this.formShowed = false;
          this.newUser = new User(null, "new User Name", "new Pass", "new Name", "new Last Name",
          "new Email",  true, "123123");
        },
        err => {
          if (err.status != 409)
            this.toastr.error("There was a problem with adding the validator");
          else
            this.toastr.error("Validator with given id does not exist"); 
        }
      )
    }

    // adding new validator
    else
    {
      this.userService.addValidator(this.newUser).subscribe(
        () => {
          this.userService.getByUsername(this.newUser.username).subscribe(
            response => {
              this.newUser = response;
              this.validators.push(this.newUser);
              this.table.renderRows();
              this.newUser = new User(null, "new User Name", "new Pass", "new Name", "new Last Name",
              "new Email",  true, "123123");
              this.toastr.info("Validator succesfully added!")
            },
            err => {this.toastr.error("There was a problem with adding the validator"); }
          )
        },
        err => {
          if (err.status != 409)
            this.toastr.error("There was a problem with adding the validator");
          else
            this.toastr.error("Validator with given username already exists"); 
        }
      )
      this.formShowed = false;
    }
    this.addName = true;
  }

  showForm()
  {
    this.newUser = new User(null, "new User Name", "new Pass", "new Name", "new Last Name",
    "new Email",  true, "123123");
    this.formShowed = true;
  }

  cancelForm(){
    this.formShowed = false;
    this.addName = true;
  }

  showChangeForm(user: User)
  {
    this.newUser = user;
    this.formShowed = true;
    this.addName = false;
  }
}
