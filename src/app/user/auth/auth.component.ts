import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/users/user.model';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  user: User = new User(0, "", "", "", "", "", true, "");


  constructor(private authService: AuthService,
    private router: Router,
    private toastr: ToastrService) { }

  ngOnInit() {}

  signin(): void {
    this.authService.authenticate(this.user).subscribe(
      response => {
        this.toastr.success(`Welcome ${this.user.username}`);
        this.router.navigate(['home']);
      },
      err => { });
  }
  

}