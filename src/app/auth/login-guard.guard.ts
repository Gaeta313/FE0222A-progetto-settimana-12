import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class LoginGuardGuard implements CanActivate {
  user!: any;
  sub = this.authSrv.user$.subscribe((val) => {
    this.user = val;
  });
  // la condizione che la guardia verifica è che non ci sia un utente che abbia effettuato il login
  constructor(private authSrv: AuthService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!this.user) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
