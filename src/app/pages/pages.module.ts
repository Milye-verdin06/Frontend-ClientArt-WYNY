import { NgModule, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatRadioModule } from '@angular/material/radio';

import { ArticulosClienteComponent } from './articulos-cliente/articulos-cliente.component';
import { SharedModule } from '../shared/shared.module';
import { PagesComponent } from './pages.component';
import { AgregarArticulosComponent } from './agregar-articulos marroquineria/agregar-articulos marroquineria.component';
import { AgregarArticulosSuelaComponent } from './agregar-articulos suela/agregar-articulos suela.component';
import { AgregarArticulosCintosComponent } from './agregar-articulos cintos/agregar-articulos cintos.component';
import { AgregarArticulosPielComponent } from './agregar-articulos piel/agregar-articulos piel.component';
import { AgregarArticulosTirasComponent } from './agregar-articulos tiras/agregar-articulos tiras.component';
import { AgregarArticulosSuajadoComponent } from './agregar-articulos suajado/agregar-articulos suajado.component';
import { SaldosClienteComponent } from './saldos-cliente/saldos-cliente.component';
import { PipeFilterPipe } from './pipes/pipe-filter.pipe';
import { PeticionesService } from '../services/peticiones.service';
import { NopagefoundComponent } from '../nopagefound/nopagefound.component';

@NgModule({
  declarations: [
    PagesComponent,
    ArticulosClienteComponent,
    AgregarArticulosComponent,
    AgregarArticulosSuelaComponent,
    AgregarArticulosCintosComponent,
    AgregarArticulosPielComponent,
    AgregarArticulosTirasComponent,
    AgregarArticulosSuajadoComponent,
    SaldosClienteComponent,
    NopagefoundComponent,
    PipeFilterPipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule,
    MatMenuModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
    MatBottomSheetModule,
    MatListModule,
    MatInputModule,
    ReactiveFormsModule,
    MatCardModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatTableModule,
    NgxPaginationModule,
    MatRadioModule,
  ],
  providers: [PeticionesService],

  exports: [
    PagesComponent,
    ArticulosClienteComponent,
    MatDialogModule,
    NopagefoundComponent,
  ],
})
export class PagesModule {}
