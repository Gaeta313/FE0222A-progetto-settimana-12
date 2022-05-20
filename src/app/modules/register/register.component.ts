import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/interfaces/user';
import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registeredUser!: User;
  errorMessage!: string;
  @ViewChild('f', { static: true }) form: any;
  constructor(private authSrv: AuthService, private router: Router) {}

  ngOnInit(): void {}

  //Registrazione utente con messaggi di errore catturati e gestiti dall'interceptor
  async onSubmit() {
    this.registeredUser = {
      email: this.form.value.email,
      password: this.form.value.password,
      name: this.form.value.name,
      id: undefined,
    };
    try {
      await lastValueFrom(this.authSrv.signup(this.registeredUser)); // in gran parte del codice utilizzerò lastValueFrom(), perchè toPromise() è deprecata
      this.router.navigate(['/login']);
    } catch (error: any) {
      this.errorMessage = error;
    }
  }
}
