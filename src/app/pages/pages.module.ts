import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ArticulosClienteComponent } from './articulos-cliente/articulos-cliente.component';
import { SharedModule } from '../shared/shared.module';
import { PagesComponent } from './pages.component';
import { AgregarArticulosComponent } from './agregar-articulos/agregar-articulos.component';
import { EspecificacionesComponent } from './especificaciones/especificaciones.component';

@NgModule({
  declarations: [PagesComponent, ArticulosClienteComponent, AgregarArticulosComponent, EspecificacionesComponent],
  imports: [CommonModule, SharedModule, RouterModule],
  exports: [PagesComponent, ArticulosClienteComponent],
})
export class PagesModule {}
