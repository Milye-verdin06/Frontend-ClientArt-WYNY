import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { LoginComponent } from './login/login.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';

@NgModule({
  declarations: [LoginComponent, ForbiddenComponent],
  imports: [CommonModule, RouterModule, NgbModule],
  exports: [LoginComponent, ForbiddenComponent],
})
export class AuthModule {}
