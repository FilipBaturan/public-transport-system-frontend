import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { AuthComponent } from './auth/auth.component';
import { RegUserListComponent } from './reg-user-list/reg-user-list.component';
import { SignupComponent } from './signup/signup.component';
import { UnconfirmedUserListComponent } from './unconfirmed-user-list/unconfirmed-user-list.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserTicketsComponent } from './user-tickets/user-tickets.component';
import { ValidatorListComponent } from './validator-list/validator-list.component';
import { RouterModule } from '@angular/router';
import { OperatorListComponent } from './operator-list/operator-list.component';

@NgModule({
  declarations: [
    AuthComponent,
    RegUserListComponent,
    SignupComponent,
    UnconfirmedUserListComponent,
    UserProfileComponent,
    UserTicketsComponent,
    ValidatorListComponent,
    OperatorListComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    AuthComponent,
    RegUserListComponent,
    SignupComponent,
    UnconfirmedUserListComponent,
    UserProfileComponent,
    UserTicketsComponent,
    ValidatorListComponent,
    RouterModule
  ]
})
export class UserModule { }
