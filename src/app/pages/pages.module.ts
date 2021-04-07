import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';

import { ArticulosClienteComponent } from './articulos-cliente/articulos-cliente.component';
import { SharedModule } from '../shared/shared.module';
import { PagesComponent } from './pages.component';
import { AgregarArticulosComponent } from './agregar-articulos/agregar-articulos.component';
import { EspecificacionesComponent } from './especificaciones/especificaciones.component';

@NgModule({
  declarations: [PagesComponent, ArticulosClienteComponent, AgregarArticulosComponent, EspecificacionesComponent],
  imports: [CommonModule,FormsModule, SharedModule, RouterModule,MatMenuModule,MatIconModule,
    MatSelectModule,MatButtonModule],
  exports: [PagesComponent, ArticulosClienteComponent],
})
export class PagesModule {}
