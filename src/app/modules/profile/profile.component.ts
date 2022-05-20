import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { LoggedUser } from 'src/app/interfaces/logged-user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user!: LoggedUser | null;
  sub!: Subscription;

  constructor(private authSrv: AuthService) {}

  ngOnInit(): void {
    this.sub = this.authSrv.user$.subscribe((val) => {
      this.user = val;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
