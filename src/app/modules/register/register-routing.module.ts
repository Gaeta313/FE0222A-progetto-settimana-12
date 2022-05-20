import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuardGuard } from 'src/app/auth/login-guard.guard';
import { RegisterComponent } from './register.component';

const routes: Routes = [
  { path: '', component: RegisterComponent, canActivate: [LoginGuardGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterRoutingModule {}
