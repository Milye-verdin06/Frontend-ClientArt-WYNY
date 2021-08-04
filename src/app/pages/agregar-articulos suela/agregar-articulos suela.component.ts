import { AprobationService } from 'src/app/services/Smarroquineria/aprobation.service';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { CombinacionRespons, ReqLineas } from 'src/app/models/suela/articuloS';
import { parametroSService } from 'src/app/services/Ssuela/parametroS.service';
import { ReqPlanchado, ReqCombinacion } from '../../models/suela/articuloS';
import { map, startWith } from 'rxjs/operators';
import {
  MatAutocomplete,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';

interface Acabado {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-agregar-articulosSuela',
  templateUrl: './agregar-articulos suela.component.html',
})
export class AgregarArticulosSuelaComponent implements OnInit {
  isDisabledselePlanchado = true; //no permitir seleccionar el planchado, hasta seleccionar la linea
  isDisabledseleGrosor = true; //no permitir seleccionar el grosor, hasta seleccionar el planchado
  isDisabledseleColorAC = true; //no seleccionar ningun color en el mat-input de Colores
  isDisabledseleAcabado = true; //no seleccionar ningun acabado en el mat-input de acabados

  isDisabledAcabado = true; //deshabilitar el select de acabado hasta que seleccionen el grosor
  isDisabledseleSeleccion = true; //deshabilitar la seleccion hasta que indicas si es tenido, acabado o natural

  nomCliente: any;
  codCliente: any;
  unidadSelecc: any;

  divisaSelecc: any;
  nomDivisa: any;
  unidadNSelecc: any;
  public filteredOptionsColoresAC: Observable<ReqCombinacion[]>[] = [];
  public filteredOptionsAcabados: Observable<ReqCombinacion[]>[] = [];
  public datos_linea: ReqLineas[] = [];
  public datos_planchado: ReqPlanchado[] = [];
  public datos_combinacionGR: ReqCombinacion[] = [];
  public datos_combinacionCL: ReqCombinacion[] = [];
  public datos_combinacionAC: ReqCombinacion[] = [];

  selectedLinea: ReqLineas;
  selectedPlanchado: ReqPlanchado;
  selectedCombinacionGR: ReqCombinacion;
  selectedCombinacionCL: ReqCombinacion;
  selectedCombinacionACC: ReqCombinacion;
  selectedAcabado: Acabado;
  optionsColoresAC: ReqCombinacion[] = [];
  optionsAcabados: ReqCombinacion[] = [];

  public Colores: CombinacionRespons[] = [];
  public selectedColorNameAC: string;

  myControls: FormControl[] = [new FormControl('')];
  myControl2: FormControl[] = [new FormControl('')];
  myControl3: FormControl[] = [new FormControl('')];

  acabado: Acabado[] = [
    { value: 'NA', viewValue: 'NATURAL' },
    { value: 'TC', viewValue: 'TENIDO' },
    { value: 'U1', viewValue: 'ACABADO' },
  ];

  constructor(
    private aprobationService: AprobationService,
    private router: Router,
    private parametroSService: parametroSService
  ) {
    this.selectedAcabado = this.acabado[1];
    this.selectedLinea = this.datos_linea[1];
    this.selectedPlanchado = this.datos_planchado[1];
    this.selectedCombinacionGR = this.datos_combinacionGR[1];
    this.selectedCombinacionCL = this.datos_combinacionCL[1];
    this.selectedCombinacionACC = this.datos_combinacionCL[1];

    this.Colores = [];
    this.selectedColorNameAC = '';
  }

  ngOnInit() {
    this.parametroSService.getlinea().subscribe(
      (resp) => {
        this.datos_linea = resp.data;
      },
      (error) => console.log(error)
    );
    this._servicetoVar();
  }

  public displayFnColoresAC(color: ReqCombinacion): string {
    return color && String(color.descripcion).trim()
      ? String(color.descripcion).trim()
      : '';
  }
  private _filterColoresAC(descripcion: string): ReqCombinacion[] {
    const filterValueC = descripcion.toLowerCase();

    return this.optionsColoresAC.filter(
      (option) => option.descripcion.toLowerCase().indexOf(filterValueC) === 0
    );
  }

  codSelectedColoresAC(
    codigo: ReqCombinacion,
    trigger: MatAutocompleteTrigger,
    auto: MatAutocomplete
  ) {
    this.selectedCombinacionCL = {
      linea: codigo.linea,
      descripcionLinea: codigo.descripcionLinea,
      codigo: codigo.codigo,
      descripcion: codigo.descripcion,
    };
    this.selectedColorNameAC = codigo.descripcion;
    this, this.myControl2[0].setValue(this.selectedCombinacionCL);
  }
  public displayFnAcabados(acabado: ReqCombinacion): string {
    return acabado && String(acabado.descripcion).trim()
      ? String(acabado.descripcion).trim()
      : '';
  }
  private _filterAcabado(descripcion: string): ReqCombinacion[] {
    const filterValueC = descripcion.toLowerCase();

    return this.optionsColoresAC.filter(
      (option) => option.descripcion.toLowerCase().indexOf(filterValueC) === 0
    );
  }
  codSelectedAcabados(
    codigo: ReqCombinacion,
    trigger: MatAutocompleteTrigger,
    auto: MatAutocomplete
  ) {
    this.selectedCombinacionACC = {
      linea: codigo.linea,
      descripcionLinea: codigo.descripcionLinea,
      codigo: codigo.codigo,
      descripcion: codigo.descripcion,
    };
    this.selectedColorNameAC = codigo.descripcion;
    this, this.myControls[0].setValue(this.selectedCombinacionACC);
  }

  mostrarPlanchado() {
    const body = {
      vLinea: this.selectedLinea.tp_codi,
    };
    this.parametroSService.getplanchado(body).subscribe(
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
    this.parametroSService.getcombinacion(body).subscribe(
      (resp) => {
        this.datos_combinacionGR = resp.data;
      },
      (error) => console.log(error)
    );
  }

  mostrarClasificacion() {
    const body = {
      vLinea: this.selectedLinea.tp_codi,
      vTabla: 'S',
    };
    this.parametroSService.getcombinacion(body).subscribe(
      (resp) => {
        this.datos_combinacionCL = resp.data;
      },
      (error) => console.log(error)
    );
  }

  mostrarAcabado() {
    const bodyA = {
      vLinea: this.selectedLinea.tp_codi,
      vTabla: 'A',
    };
    this.parametroSService.getcombinacion(bodyA).subscribe(
      (resp) => {
        this.optionsAcabados = resp.data;
      },
      (error) => console.log(error)
    );
    this.filteredOptionsAcabados.push(
      this.myControls[0].valueChanges.pipe(
        startWith(''),
        map((value) => (typeof value === 'string' ? value : value.codigo)),
        map((name) =>
          name ? this._filterAcabado(name) : this.optionsAcabados.slice()
        )
      )
    );
  }
  mostrarcolor() {
    const body = {
      vLinea: this.selectedLinea.tp_codi,
      vTabla: 'C',
    };
    this.parametroSService.getcombinacion(body).subscribe(
      (resp) => {
        this.optionsColoresAC = resp.data;
      },
      (error) => console.log(error)
    );
    this.filteredOptionsColoresAC.push(
      this.myControl2[0].valueChanges.pipe(
        startWith(''),
        map((value) => (typeof value === 'string' ? value : value.codigo)),
        map((name) =>
          name ? this._filterColoresAC(name) : this.optionsColoresAC.slice()
        )
      )
    );
  }
  selectedLineaChange(values: ReqLineas) {
    this.mostrarcolor();
    this.mostrarAcabado();

    this, this.myControl2[0].setValue(this.selectedCombinacionCL);
    this, this.myControls[0].setValue(this.selectedCombinacionACC);

    this.mostrarPlanchado();
    this.isDisabledselePlanchado = false;
    this.mostrarGrosor();

    this.mostrarClasificacion();
    this.selectedAcabado = {
      value: '',
      viewValue: '',
    };
    this.selectedCombinacionCL = {
      linea: '',
      descripcionLinea: '',
      codigo: '',
      descripcion: '',
    };
    this.selectedCombinacionACC = {
      linea: '',
      descripcionLinea: '',
      codigo: '',
      descripcion: '',
    };
  }

  selectedPlanchadoChange(values: ReqPlanchado) {
    this.isDisabledseleGrosor = false;
    this.selectedCombinacionCL = {
      linea: '',
      descripcionLinea: '',
      codigo: '',
      descripcion: '',
    };
  }
  selectedGrosorChange(values: ReqCombinacion) {
    this.isDisabledAcabado = false;

    this.selectedCombinacionCL = {
      linea: '',
      descripcionLinea: '',
      codigo: '',
      descripcion: '',
    };
  }
  selectAcabadoChangue(values: any) {
    this.isDisabledseleSeleccion = false;
    console.log(this.selectedAcabado.value);
    if (this.selectedAcabado.value == 'TC') {
      this.isDisabledseleColorAC = false; //no seleccionar ningun color en el mat-input de Colores
      this.isDisabledseleAcabado = true;
    } else if (this.selectedAcabado.value == 'U1') {
      this.isDisabledseleColorAC = false;
      this.isDisabledseleAcabado = false; //no seleccionar ningun color en el mat-input de Colores
    } else {
      this.isDisabledseleColorAC = true;
      this.isDisabledseleAcabado = true;
    }

    this, this.myControl2[0].setValue(this.selectedCombinacionCL);
    this, this.myControls[0].setValue(this.selectedCombinacionACC);
    this.selectedCombinacionCL = {
      linea: '',
      descripcionLinea: '',
      codigo: '',
      descripcion: '',
    };
    this.selectedCombinacionACC = {
      linea: '',
      descripcionLinea: '',
      codigo: '',
      descripcion: '',
    };
    console.log(this.optionsColoresAC);
    console.log(this.optionsAcabados);
  }
  selectedClasificacionChange(values: ReqCombinacion) {}

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
