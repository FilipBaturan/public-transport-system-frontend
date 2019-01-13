import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/users/user.model';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  user: User = new User(0, '', '', '', '', '', true, '');


  constructor(private userService: UserService,
    private authSerivce: AuthService,
    private router: Router,
    private toastr: ToastrService) { }

  ngOnInit() {
  }

  signin(): void {
    this.userService.authenticate(this.user).subscribe(
      response => {
        this.toastr.success(`Welcome ${this.user.username}`);
        this.router.navigate(['home']);
      },
      err => { this.toastr.warning('Nisi se ulogovao'); });
  }

}
