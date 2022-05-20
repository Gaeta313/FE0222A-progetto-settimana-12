import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, switchMap, tap } from 'rxjs';
import { Favorite } from '../../interfaces/favorite';
import { Movies } from '../../interfaces/movies';

@Injectable({
  providedIn: 'root',
})
export class MoviesSrvService {
  moviesSub = new BehaviorSubject<null | Movies[]>(null);
  movies$ = this.moviesSub.asObservable();

  constructor(private http: HttpClient) {}

  //deprecata, non viene utilizzata, la lascio solo a scopo didattico, perchè questa era la getMovies() semplice,
  // che restitutisce i Movies_popular, tap() viene utilizzato per passare i dati al movieSub(BehaviorSubject)
  getMovies() {
    return this.http.get<Movies[]>('http://localhost:4201/movies-popular').pipe(
      tap((data) => {
        this.moviesSub.next(data);
      })
    );
  }

  //deprecata, non viene utilizzata, era associata alla funzione getMovies(),
  //per restituirre i film filtrati per generi di Movies-popular
  getMoviesByGenre(genere: number) {
    return this.http.get<Movies[]>('http://localhost:4201/movies-popular').pipe(
      tap((movies) => {
        let nuovo = movies.filter((movie) =>
          movie.genre_ids.find((val) => val == genere)
        );
        this.moviesSub.next(nuovo);
      })
    );
  }

  //La versione potenziata di getMovies(), unisce le chiamate tramite switchMap e restituisce
  // tutti i movie presenti nel db(Movies-popular && movies-toprated), passando il risultato in
  //  un BehaviorSubject
  getMoviesFull() {
    return this.http.get<Movies[]>('http://localhost:4201/movies-popular').pipe(
      switchMap((data1) => {
        return this.http
          .get<Movies[]>('http://localhost:4201/movies-toprated')
          .pipe(
            tap((data2) => {
              const NUOVO: Movies[] = [...data1, ...data2];
              this.moviesSub.next(NUOVO);
            })
          );
      })
    );
  }

  //Utilizza il codice di getMOviesFull(), e quando ha ottenuto l'array unificato delle due chiamate,
  // tramite tap() filtra(filter) il riusltato cercando se il film contiene(find) il genere:number nel proprio array di generi,
  // passa il risultato in un BehaviorSubject
  getMoviesByGenreFull(genere: number) {
    return this.http.get<Movies[]>('http://localhost:4201/movies-popular').pipe(
      switchMap((data1) => {
        return this.http
          .get<Movies[]>('http://localhost:4201/movies-toprated')
          .pipe(
            tap((data2) => {
              const NUOVO: Movies[] = [...data1, ...data2];
              const FILTRATO = NUOVO.filter((movie) =>
                movie.genre_ids.find((val) => val == genere)
              );
              this.moviesSub.next(FILTRATO);
            })
          );
      })
    );
  }

  getGeneri() {
    return this.http.get<any[]>('http://localhost:4201/genres');
  }

  getFavorites() {
    return this.http.get<Favorite[]>('http://localhost:4201/favorites');
  }

  // posta un nuovo favorito nel db
  favoritePost(data: Favorite) {
    return this.http.post<Favorite>('http://localhost:4201/favorites', data);
  }
  // elimina un favorito nel db
  favoriteDelete(id: number) {
    return this.http.delete<Favorite>('http://localhost:4201/favorites/' + id);
  }
}
