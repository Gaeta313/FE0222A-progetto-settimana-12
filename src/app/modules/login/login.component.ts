import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/interfaces/user';
import { lastValueFrom, Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  user!: User;
  errorMessage!: string;
  @ViewChild('f', { static: true }) form!: any;
  subUser!: Subscription;

  constructor(private authSrv: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.subUser = this.authSrv.user$.subscribe();
  }

  //login function
  // i messaggi di errore contenuti in errorMessage, arrivano dall'interceptor
  async onSubmit() {
    this.user = {
      email: this.form.value.email,
      password: this.form.value.password,
      name: this.form.value.name,
      id: undefined,
    };
    try {
      await lastValueFrom(this.authSrv.login(this.user)); // in gran parte del codice utilizzerò lastValueFrom(), perchè toPromise() è deprecata
      this.form.reset();
      this.router.navigate(['/']);
    } catch (error: any) {
      this.errorMessage = error;
    }
  }

  ngOnDestroy() {
    this.subUser.unsubscribe();
  }
}
