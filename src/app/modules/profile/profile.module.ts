import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidebarModule } from '../sidebar/sidebar.module';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    MatSidenavModule,
    SidebarModule,
    MatToolbarModule,
    MatCardModule,
  ],
})
export class ProfileModule {}
