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

@NgModule({
  declarations: [
    AuthComponent,
    RegUserListComponent,
    SignupComponent,
    UnconfirmedUserListComponent,
    UserProfileComponent,
    UserTicketsComponent,
    ValidatorListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      { path: 'userTickets/:id', component: UserTicketsComponent},
      { path: 'signin', component: AuthComponent},
      { path: 'signup', component: SignupComponent},
      { path: 'unconfirmedUsers', component: UnconfirmedUserListComponent},
      { path: 'userProfile', component: UserProfileComponent},
      { path: 'validators', component: ValidatorListComponent},
      { path: 'registeredUsers', component: RegUserListComponent},
      { path: 'profile', component: UserProfileComponent},
    ]),
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
