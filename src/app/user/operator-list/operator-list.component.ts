import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { User } from '../../model/users/user.model';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/core/services/user.service';

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
  changedUser: User;

  changeFormShowed: boolean;

  constructor(private userService: UserService, private toastr: ToastrService,
    private changeDetectorRefs: ChangeDetectorRef) { }

  
  

  ngOnInit() {

    //ruganje gore
    this.newUser = new User(null, "newUserName", "newPass", "newName", "newLastName", "newEmail", 
                    true, "123123");


    this.changeFormShowed = false;

    this.userService.getOperators().subscribe(
      response => {
        this.operators = response;
        console.log(this.operators); 
        this.checkUsersLength();
      }
    )
  }

  showChangeForm(user:User)
  {
    this.toastr.info("Show form!");
  }

  blockOperator(user:User)
  {
    user.active = false;
    this.userService.blockOperator(user).subscribe(
      response => {
        if (response == false)
          this.toastr.info("A problem occured when trying to block the operator!");
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

  addOperator(){

    this.userService.addOperator(this.newUser).subscribe(
      response => {
        if (response == false)
          this.toastr.info("A problem occured when trying to add the operator!");
        else
        {
          this.operators.push(this.newUser);
          this.toastr.info("Operator succesfully added!")
        }
        
        this.checkUsersLength();
      }
    )
  }


  checkUsersLength(){
    if (this.operators.length == 0)
      this.noUsers = true;
    else
      this.noUsers = false;
  }

}

