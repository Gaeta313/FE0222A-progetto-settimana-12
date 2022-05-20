import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, map, tap } from 'rxjs';
import { LoggedUser } from '../interfaces/logged-user';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authSubject = new BehaviorSubject<null | LoggedUser>(null); // in questo subject vengono passati i dati dell'utente loggato
  user$ = this.authSubject.asObservable(); // questo è il subject precedente trasformato in observable
  loggedIn$ = this.user$.pipe(map((user) => !!user));
  JwtHelper = new JwtHelperService();

  constructor(private http: HttpClient, private router: Router) {
    this.controlToken();
  }

  ngOnInit() {}

  //recupera nel local storage il token se esite e non è scaduto
  controlToken() {
    let userJson = localStorage.getItem('user');
    if (!userJson) {
      return;
    }
    const user: LoggedUser = JSON.parse(userJson);
    if (this.JwtHelper.isTokenExpired(user.accessToken)) {
      this.logout();
    } else {
      this.authSubject.next(user);
    }
  }

  signup(user: User) {
    return this.http.post('http://localhost:4201/register', user);
  }

  login(user: User) {
    return this.http.post<LoggedUser>('http://localhost:4201/login', user).pipe(
      tap((user) => {
        this.authSubject.next(user);
        localStorage.setItem('user', JSON.stringify(user));
      })
    );
  }

  logout() {
    this.authSubject.next(null);
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
