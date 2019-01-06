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

  displayedColumns: string[] = ['firstName', 'lastName', 'userName', 'email','docs', 'change', 'delete']

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

    this.userService.addValidator(this.newUser).subscribe(
      response => {
        if (response == false)
          this.toastr.info("There was a problem with adding the validator");
        else
        {
          this.validators.push(this.newUser);
          this.table.renderRows();
          this.toastr.info("Validator succesfully added!")
        }
        
        this.checkUsersLength();
      }
    )

    this.formShowed = false;
  }


  checkUsersLength(){
    if (this.validators.length == 0)
      this.noUsers = true;
    else
      this.noUsers = false;
  }

}
