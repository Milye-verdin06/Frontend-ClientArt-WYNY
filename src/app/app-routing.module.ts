import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { ArticulosClienteComponent } from './pages/articulos-cliente/articulos-cliente.component';
import { NopagefoundComponent } from './pages/nopagefound/nopagefound.component';
import { LoginComponent } from './auth/login/login.component';
import { PagesComponent } from './pages/pages.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      { path: 'articulos-cliente', component: ArticulosClienteComponent },
      { path: '', redirectTo: '/articulos-cliente', pathMatch: 'full' },
    ],
  },
  { path: 'login', component: LoginComponent },
  { path: '**', component: NopagefoundComponent },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
