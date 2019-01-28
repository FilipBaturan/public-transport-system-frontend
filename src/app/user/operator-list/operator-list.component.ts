import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { MatTable } from '@angular/material';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { User } from '../../model/users/user.model';
import { UserService } from 'src/app/core/services/user.service';



@Component({
  selector: 'app-operator-list',
  templateUrl: './operator-list.component.html',
  styleUrls: ['./operator-list.component.css']
})
export class OperatorListComponent implements OnInit {

  displayedColumns: string[] = ['firstName', 'lastName', 'userName', 'email', 'change', 'delete'];

  dataSource: any[];

  operators: User[] = [];
  noUsers: boolean;


  newUser: User;

  formShowed: boolean;
  addName: boolean;

  private modalForm: NgbModalRef;

  @ViewChild(MatTable) table: MatTable<any>;

  constructor(private userService: UserService, private toastr: ToastrService,
    private changeDetectorRefs: ChangeDetectorRef) { }

  ngOnInit() {


    this.newUser = new User(null, 'newUserName', 'newPass', 'newName', 'newLastName', 'newEmail',
      true, '123123');

    this.formShowed = false;
    this.addName = true;

    this.userService.getOperators().subscribe(
      response => {
        this.operators = response;
        this.checkUsersLength();
      }
    );
  }

  blockOperator(user: User) {
    if (user.id === null) {
      this.toastr.warning('Please refresh the page to block this operator!');
    } else {
      user.active = false;
      this.userService.updateOperator(user).subscribe(
        response => {
          if (response === false) {
            this.toastr.info('A problem occured when blocking the operator!');
          } else {
            const index = this.operators.indexOf(user);
            const copiedData = this.operators.slice();
            copiedData.splice(index, 1);
            this.operators = copiedData;

            this.toastr.info('Operator succesfully blocked!');
          }

          this.checkUsersLength();

        },
        err => {
          if (err.status !== 409) {
            this.toastr.error('There was a problem when blocking the operator');
          } else {
            this.toastr.error('Operator with given id does not exist');
          }
        }
      );
      this.changeDetectorRefs.detectChanges();
    }

  }

  addOperator() {

    // updating operator
    if (this.newUser.id != null) {
      this.userService.updateOperator(this.newUser).subscribe(
        response => {
          this.toastr.info('Operator succesfully updated!');
          this.formShowed = false;
          this.newUser = new User(null, 'new User Name', 'new Pass', 'new Name', 'new Last Name',
            'new Email', true, '123123');
        },
        err => {
          if (err.status !== 409) {
            this.toastr.error('There was a problem with adding the operator');
          } else {
            this.toastr.error('Operator with given id does not exist');
          }
        }
      );
    } else { // adding new operator
      this.userService.addOperator(this.newUser).subscribe(
        response => {
          this.userService.getOpByUsername(this.newUser.username).subscribe(
            res => {
              this.newUser = res;
              this.operators.push(this.newUser);
              this.newUser = new User(null, 'new User Name', 'new Pass', 'new Name', 'new Last Name',
                'new Email', true, '123123');
              this.table.renderRows();
              this.toastr.info('Operator succesfully added!');
            },
            err => {
              this.toastr.error('There was a problem with adding the validator');
            }
          );
          this.checkUsersLength();
        },
        err => {
          if (err.status !== 409) {
            this.toastr.error('There was a problem when adding the operator');
          } else {
            this.toastr.error('Operator with given id does not exist');
          }
        }
      );

      this.formShowed = false;
    }
    this.addName = true;
  }

  cancelForm() {
    this.formShowed = false;
    this.addName = true;
  }

  checkUsersLength() {
    if (this.operators.length === 0) {
      this.noUsers = true;
    } else {
      this.noUsers = false;
    }
  }

  showForm() {
    this.formShowed = true;
  }

  showChangeForm(user: User) {
    this.newUser = user;
    this.formShowed = true;
    this.addName = false;
  }

}
