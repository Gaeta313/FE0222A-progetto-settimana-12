import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
} from '@angular/common/http';
import { catchError, Observable, switchMap, take } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authSrv: AuthService) {}

  //l'interceptor viene utilizzato per il passaggio del token alle chiamate, e la cattura e gestione degli errori,
  // sopratutto in fase di login e registrazione
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return this.authSrv.user$.pipe(
      take(1),
      switchMap((user) => {
        const newReq = request.clone({
          headers: request.headers.set(
            'Authorization',
            `Bearer ${user?.accessToken}`
          ),
        });
        return next.handle(newReq);
      }),
      catchError((err) => {
        //questa parte di interceptor cattura e traduce gli errori, sopratutto login e registrazione
        switch (err.error) {
          case 'Email and password are required':
            throw new Error('Email e password sono obbligatori');
          case 'Email already exists':
            throw new Error("L'email scelta è già utilizzata");
          case 'Email format is invalid':
            throw new Error('Formato email non valido');
          case 'Incorrect password':
            throw new Error('La password non è corretta');
          case 'Cannot find user':
            throw new Error('Utente non trovato');
          case 'Password is too short':
            throw new Error('La password è troppo corta');
        }
        throw new Error('Errore nella richiesta');
      })
    );
  }
}
