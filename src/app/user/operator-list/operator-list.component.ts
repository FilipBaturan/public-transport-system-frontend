import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { User } from '../../model/users/user.model';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/core/services/user.service';
import { MatTable } from '@angular/material';


@Component({
  selector: 'app-operator-list',
  templateUrl: './operator-list.component.html',
  styleUrls: ['./operator-list.component.css']
})
export class OperatorListComponent implements OnInit {

  displayedColumns: string[] = ['firstName', 'lastName', 'userName', 'email', 'change', 'delete']

  dataSource : any[];

  operators: User[] = [];
  noUsers: boolean;
  
  //Ruganje gore (mock up)
  newUser: User;

  formShowed: boolean;

  @ViewChild(MatTable) table: MatTable<any>;

  constructor(private userService: UserService, private toastr: ToastrService,
    private changeDetectorRefs: ChangeDetectorRef) { }

  ngOnInit() {

    //ruganje gore
    this.newUser = new User(null, "newUserName", "newPass", "newName", "newLastName", "newEmail", 
                    true, "123123");

    this.formShowed = false;

    this.userService.getOperators().subscribe(
      response => {
        console.log(response);
        this.operators = response;
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
    console.log(user);
    this.newUser = user;
    this.showForm();
  }

  blockOperator(user:User)
  {
    if (user.id == null)
      this.toastr.warning("Please refresh the page to block this operator!");
    else
    {
      user.active = false;
      this.userService.updateOperator(user).subscribe(
        response => {
          if (response == false)
            this.toastr.info("There was a problem with blocking the operator!");
          else
          {
            var index = this.operators.indexOf(user);
            const copiedData =  this.operators.slice();
            copiedData.splice(index, 1);
            this.operators = copiedData;
           
            this.toastr.info("Operator succesfully blocked!")
          }
          
          this.checkUsersLength();
            
        }
      )
      this.changeDetectorRefs.detectChanges();
    }

  }

  addOperator(){

    // updating operator
    if (this.newUser.id != null)
    {
      this.userService.updateOperator(this.newUser).subscribe(
        response => {
          if (response == false)
            this.toastr.error("There was a problem with updating the operator");
          else
          {
            this.toastr.info("Operator succesfully updated!");
            this.formShowed = false;
            this.newUser = new User(null, "new User Name", "new Pass", "new Name", "new Last Name",
            "new Email",  true, "123123");
          }
        }
      )
    }
    // adding new operator
    else
    {
      this.userService.addOperator(this.newUser).subscribe(
        response => {
          if (response == false)
            this.toastr.info("There was a problem with adding the operator");
          else
          {
            this.userService.getByUsername(this.newUser.username).subscribe(
              response => {
                if (response != null)
                {
                  this.newUser = response;
                  this.operators.push(this.newUser);
                  this.newUser = new User(null, "new User Name", "new Pass", "new Name", "new Last Name",
                  "new Email",  true, "123123");
                  this.table.renderRows();
                  this.toastr.info("Operator succesfully added!")
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
    if (this.operators.length == 0)
      this.noUsers = true;
    else
      this.noUsers = false;
  }

}
