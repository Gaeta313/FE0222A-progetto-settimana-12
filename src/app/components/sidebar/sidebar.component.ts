import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {


  constructor(private authSrv: AuthService, private router:Router) { }

  ngOnInit(): void {
  }

  //collegamento alla funzione logout di AuthService
  onLogout(){
    this.authSrv.logout();
  }

}
