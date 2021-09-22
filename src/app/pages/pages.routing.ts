import { GuardsGuard } from '../auth/guards.guard';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { ArticulosClienteComponent } from './articulos-cliente/articulos-cliente.component';
import { AgregarArticulosComponent } from './agregar-articulos marroquineria/agregar-articulos marroquineria.component';
import { AgregarArticulosSuelaComponent } from './agregar-articulos suela/agregar-articulos suela.component';
import { AgregarArticulosCintosComponent } from './agregar-articulos cintos/agregar-articulos cintos.component';
import { AgregarArticulosPielComponent } from './agregar-articulos piel/agregar-articulos piel.component';
import { AgregarArticulosTirasComponent } from './agregar-articulos tiras/agregar-articulos tiras.component';
import { AgregarArticulosSuajadoComponent } from './agregar-articulos suajado/agregar-articulos suajado.component';
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
      {
        path: 'add-articulos-cintos',
        component: AgregarArticulosCintosComponent,
      },
      {
        path: 'add-articulos-piel',
        component: AgregarArticulosPielComponent,
      },
      {
        path: 'add-articulos-tiras',
        component: AgregarArticulosTirasComponent,
      },
      {
        path: 'add-articulos-suajado',
        component: AgregarArticulosSuajadoComponent,
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
