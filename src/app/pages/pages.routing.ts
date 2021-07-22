import { GuardsGuard } from '../auth/guards.guard';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { ArticulosClienteComponent } from './articulos-cliente/articulos-cliente.component';
import { AgregarArticulosComponent } from './agregar-articulos marroquineria/agregar-articulos marroquineria.component';
import { AgregarArticulosSuelaComponent } from './agregar-articulos suela/agregar-articulos suela.component';
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
        path: 'add-articulos-marroquineria',
        component: AgregarArticulosComponent,
      },
      {
        path: 'saldos-cliente',
        component: SaldosClienteComponent,
      },

      {
        path: 'add-articulos-suela',
        component: AgregarArticulosSuelaComponent,
      },
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
