import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { ArticulosClienteComponent } from './articulos-cliente/articulos-cliente.component';
import { AgregarArticulosComponent } from './agregar-articulos/agregar-articulos.component';
import { EspecificacionesComponent } from './especificaciones/especificaciones.component';
import { AgregarEspecificacionesComponent } from './agregar-especificaciones/agregar-especificaciones.component';
import { NopagefoundComponent } from '../nopagefound/nopagefound.component';
import { GuardsGuard } from '../auth/guards.guard';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    canActivate: [GuardsGuard],
    children: [
      {
        path: 'articulos-cliente',
        component: ArticulosClienteComponent,
        canActivate: [GuardsGuard],
      },
      {
        path: 'agregar-articulos',
        component: AgregarArticulosComponent,
      },
      {
        path: 'agregar-especificacion',
        component: AgregarEspecificacionesComponent,
      },
      { path: 'get-especificacion', component: EspecificacionesComponent },
      { path: 'no-pagefound', component: NopagefoundComponent },
      { path: '', redirectTo: '/articulos-cliente', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
