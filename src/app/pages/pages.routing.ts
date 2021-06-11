import { GuardsGuard } from '../auth/guards.guard';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { ArticulosClienteComponent } from './articulos-cliente/articulos-cliente.component';
import { AgregarArticulosComponent } from './agregar-articulos/agregar-articulos.component';
import { EspecificacionesComponent } from './especificaciones/especificaciones.component';
import { SaldosClienteComponent } from './saldos-cliente/saldos-cliente.component';
import { NopagefoundComponent } from '../nopagefound/nopagefound.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    canActivate: [GuardsGuard],
    children: [
      {
        path: 'articulos-cliente',
        component: ArticulosClienteComponent,
      },
      {
        path: 'agregar-articulos',
        component: AgregarArticulosComponent,
      },
      {
        path: 'saldos-cliente',
        component: SaldosClienteComponent,
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
