import { AprobationService } from 'src/app/services/Smarroquineria/aprobation.service';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { ReqLineas } from 'src/app/models/suela/articuloS';
import { ArticuloSuelaService } from 'src/app/services/Ssuela/articuloS.service';
import { ReqPlanchado, ReqCombinacion } from '../../models/suela/articuloS';

interface Acabado {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-agregar-articulosSuela',
  templateUrl: './agregar-articulos suela.component.html',
})
export class AgregarArticulosSuelaComponent implements OnInit {
  isDisabledAcabado = false; //deshabilitar el select de acabado hasta que seleccionen el grosor
  selectedAcabado: Acabado;
  nomCliente: any;
  codCliente: any;
  unidadSelecc: any;

  divisaSelecc: any;
  nomDivisa: any;
  unidadNSelecc: any;
  public datos_linea: ReqLineas[] = [];
  public datos_planchado: ReqPlanchado[] = [];
  public datos_combinacion: ReqCombinacion[] = [];
  selectedLinea: ReqLineas;
  selectedPlanchado: ReqPlanchado;
  selectedCombinacion: ReqCombinacion;

  myControls: FormControl[] = [new FormControl('')];
  myControl2: FormControl[] = [new FormControl('')];
  myControl3: FormControl[] = [new FormControl('')];

  acabado: Acabado[] = [
    { value: 'NA', viewValue: 'NATURAL' },
    { value: 'TC', viewValue: 'TENIDO' },
    { value: 'UI', viewValue: 'ACABADO' },
  ];

  constructor(
    private aprobationService: AprobationService,
    private router: Router,
    private ArticuloSuelaService: ArticuloSuelaService
  ) {
    this.selectedAcabado = this.acabado[1];
    this.selectedLinea = this.datos_linea[1];
    this.selectedPlanchado = this.datos_planchado[1];
    this.selectedCombinacion = this.datos_combinacion[1];
  }

  ngOnInit() {
    this.ArticuloSuelaService.getlinea().subscribe(
      (resp) => {
        this.datos_linea = resp.data;
      },
      (error) => console.log(error)
    );
    this._servicetoVar();
  }

  mostrarPlanchado() {
    const body = {
      vLinea: this.selectedLinea.tp_codi,
    };
    this.ArticuloSuelaService.getplanchado(body).subscribe(
      (resp) => {
        this.datos_planchado = resp.data;
      },
      (error) => console.log(error)
    );
  }
  mostrarGrosor() {
    const body = {
      vLinea: this.selectedLinea.tp_codi,
      vTabla: 'G',
    };
    this.ArticuloSuelaService.getcombinacion(body).subscribe(
      (resp) => {
        this.datos_combinacion = resp.data;
      },
      (error) => console.log(error)
    );
  }

  selectedLineaChange(values: ReqLineas) {
    this.mostrarPlanchado();
    this.mostrarGrosor();
  }

  selectedPlanchadoChange(values: ReqPlanchado) {}
  selectedGrosorChange(values: ReqCombinacion) {}
  selectAcabadoChangue(values: any) {}

  private _servicetoVar() {
    this.aprobationService.getCodCliente().subscribe((d) => {
      this.codCliente = d;
    });
    this.aprobationService.getNombreCliente().subscribe((d) => {
      this.nomCliente = d;
    });
    this.aprobationService.getUnidadMedida().subscribe((d) => {
      this.unidadSelecc = d;
    });

    this.aprobationService.getDivisa().subscribe((d) => {
      this.divisaSelecc = d;
    });

    this.aprobationService.getNombreDivisa().subscribe((d) => {
      this.nomDivisa = d;
    });

    this.aprobationService.getUnidadN().subscribe((d) => {
      this.unidadNSelecc = d;
    });
  }

  isHomeRoute() {
    //dirigirse al componente principal cuando cancelan el registro de un articulo.
    this.router.navigate(['/articulos-cliente']);
  }
  submitArticulo() {}

  CancelaRegistroArticulo(selectedItem?: any) {
    Swal.fire({
      title: '¿Desea finalizar el registro del articulo?',

      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#172b4d',
      cancelButtonColor: '#BB3939',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isDismissed) {
        Swal.fire(
          'Operación interrumpida',
          'Continuar con el registro',
          'info'
        );
      } else if (result.isConfirmed) {
        {
          Swal.fire({
            icon: 'success',
            title: 'Registro de articulo finalizado',
            showConfirmButton: false,
            timer: 1600,
          });
        }

        this.isHomeRoute();
      }
    });
  }
}
