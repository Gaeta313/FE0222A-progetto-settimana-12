import { Component, Inject, OnInit } from '@angular/core';
import { lastValueFrom, Subscription } from 'rxjs';
import { Favorite } from 'src/app/interfaces/favorite';
import { MoviesSrvService } from 'src/app/modules/movies/movies-srv.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Movies } from 'src/app/interfaces/movies';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { DialogData } from 'src/app/interfaces/dialog-data';

// questa pagina contiene la dichiarazione di due component, app-movies, e app-dialog
// questo è il codice di app-movies
@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss'],
})
export class MoviesComponent implements OnInit {
  baseUrl = 'https://image.tmdb.org/t/p/w500';
  loading = true;
  loadingLike = false;
  favorites!: Favorite[];
  loggedUserID!: number | undefined; // il numero id dell'utente loggato
  subMovies!: Subscription;
  subFav!: Subscription;
  subLog!: Subscription;
  favorites$ = this.moviesSrv.getFavorites();

  movies$: any = this.moviesSrv.movies$; // questa viene iterata nel tamplate tramite | async in un ngFor
  movies!: Movies[]; // quest'altra variabile, invece è stata aggiunta per gestire il messaggio, nel caso la ricerca, non abia dato risulati
  generi: any[] = [];

  constructor(
    public dialog: MatDialog,
    private moviesSrv: MoviesSrvService,
    private authSrv: AuthService
  ) {}

  // nel ngOnInit recupero, i movies, i generi, i favoriti, e l'utente loggato
  ngOnInit(): void {
    this.subMovies = this.movies$.subscribe((data: Movies[]) => {
      this.movies = data;
    });
    this.getMovies();
    lastValueFrom(this.favorites$).then((val) => {
      this.favorites = val;
    });
    lastValueFrom(this.moviesSrv.getGeneri()).then((val) => {
      this.generi = val;
    });
    this.subLog = this.authSrv.user$.subscribe((user) => {
      this.loggedUserID = user?.user.id;
    });
  }

  // questa funzione apre in un finestra dialog, il contenuto del tamplate "dialog.html", presente nella cartella movies,
  // e dichiarato in fondo a questa pagina, il contenuto viene generato dinamicamente, in base al film selezionato
  openDialog(movie: Movies) {
    const dialogRef = this.dialog.open(Dialog, {
      width: '50%',
      data: { movie: movie },
    });
  }

  async getMovies() {
    this.loading = true;
    await lastValueFrom(this.moviesSrv.getMoviesFull()).then();
    this.loading = false;
  }

  // questa funzione gestisce tutta la parte del "mi piace":
  // stabilisce se nel database quel favorito esiste già per quell'utente,
  // dopo di che si comporta da Toggle, se il contenuto non c'è lo crea,
  // se invece c'è lo elimina
  async miPiace(movieId: number, userId: number) {
    this.loadingLike = true;
    const FIND = this.favorites.find(
      (favorite) => favorite.movieId === movieId && favorite.userId === userId
    );
    if (!FIND) {
      await this.crea(movieId, userId);
    } else {
      await this.elimina(FIND.id!);
    }
  }

  // funzione complementare di miPiace(), gestisce la creazione del favorito tramite moviesService
  private async crea(movieId: number, userId: number) {
    this.moviesSrv
      .favoritePost({ movieId: movieId, userId: userId, id: undefined })
      .subscribe((val) => {
        lastValueFrom(this.favorites$).then((val) => {
          this.favorites = val;
          this.loadingLike = false;
        });
      });
  }
  // funzione complementare di miPiace(), gestisce l'eliminazione del favorito tramite moviesService
  private async elimina(id: number) {
    this.moviesSrv.favoriteDelete(id).subscribe((val) => {
      lastValueFrom(this.favorites$).then((val) => {
        this.favorites = val;
        this.loadingLike = false;
      });
    });
  }

  // questa funzione gestisce le chiamate per genere, valore ottenuto tramite select,
  // si attiva alla scelta di un genere nel select
  async onSelect(event: any) {
    this.loading = true;
    if (event == 0) {
      await lastValueFrom(this.moviesSrv.getMoviesFull()).then();
      this.loading = false;
    } else {
      await lastValueFrom(this.moviesSrv.getMoviesByGenreFull(event)).then();
      this.loading = false;
    }
  }

  // questa funzione viene invocata dal tamplate, per stabilire il colore che deve avere il cuore
  // semplicemente se la coppia(id movie, id utente) esiste nel db favoriti, allora il cuore sarà rosso,
  // bianco altrimenti
  getColor(movieId: number, userId: number) {
    const FIND = this.favorites.find(
      (favorite) => favorite.movieId === movieId && favorite.userId === userId
    );
    if (FIND) {
      return 'red';
    } else {
      return 'white';
    }
  }

  ngOnDestroy() {
    this.subMovies.unsubscribe();
    this.subLog.unsubscribe();
  }
}

// questa ultima parte riguarda la dichiarazione del componente dialog, utilizzato dal componente movies,
// dichiara i dati che verranno passati al dialog, tramite interfaccia(DialogData)
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.html',
})
export class Dialog {
  constructor(
    public dialogRef: MatDialogRef<Dialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}
}
