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
export class AuthGuardGuard implements CanActivate {
  user!: any;
  sub = this.authSrv.user$.subscribe((val) => {
    this.user = val;
  });

  constructor(private authSrv: AuthService, private router: Router) {}

  // la condizione che la guardia verifica è che ci sia un utente che ha effettuato il login
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.user) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
