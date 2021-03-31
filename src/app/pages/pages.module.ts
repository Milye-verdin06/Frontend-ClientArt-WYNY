import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ArticulosClienteComponent } from './articulos-cliente/articulos-cliente.component';
import { SharedModule } from '../shared/shared.module';
import { PagesComponent } from './pages.component';

@NgModule({
  declarations: [PagesComponent, ArticulosClienteComponent],
  imports: [CommonModule, SharedModule, RouterModule],
  exports: [PagesComponent, ArticulosClienteComponent],
})
export class PagesModule {}
