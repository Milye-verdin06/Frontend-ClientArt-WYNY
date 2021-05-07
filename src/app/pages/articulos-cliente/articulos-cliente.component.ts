import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AprobationService } from 'src/app/services/aprobation.service';
import { clientRespons, listaCliente } from 'src/app/models/Cliente';
import { ArticuloService } from '../../services/articulo.service';
import { ReqArticulos, ReqLineas } from 'src/app/models/articulo';
import { HttpClient } from '@angular/common/http';

import { ClienteService } from 'src/app/services/cliente.service';
import { EspecificacionService } from 'src/app/services/especificacion.service';

import { FormControl, FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

import Swal from 'sweetalert2';

interface Food {
  value: string;
  viewValue: string;
}

interface Unidad {
  value: string;
  viewValue: string;
  unidadN: string;
  unidadN2: string;
  unidadN3: string;
  unidadN4: string;
  unidadN5: string;
}
interface UnidadNegocio {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-articulos-cliente',
  templateUrl: './articulos-cliente.component.html',
  styles: [],
  providers: [],
})
export class ArticulosClienteComponent implements OnInit, OnDestroy {
  isDisabled = true; //deshabilitar TextArea de especificaciones
  isDisabledButton = false; //deshabilitar el botton de agregar articulos
  isDisabledadd = true; //deshabilitar el filtro de la descricion del articulo
  isDisableunidadN = true; // deshabilitar la unidad de negocio y activar hasta que seleccione el cliente
  isDisableunidadM = true; // deshabilitar la unidad de medida y habilitar hasta que seleccione la unidad de negocio
  isDisableDivis = true; //deshabilitar la divisa y habilitar hasta que selecciona la unidad de medida
  isDisabledButtonAdd = true; //deshabilitar boton para agregar articulo hasta que se llenen los parametros
  isDisabledButtonBuscar = true; //deshabilitar el boton de buscar hasta que seleccione la divisa
  isDisabledRadioActivo = true; //deshabilitar el radio hasta que de clic en buscar
  isDisabledRadioInactivo = true; //deshabilitar el radio hasta que de clic en buscar
  alert = false;
  public pageActual: number = 1;
  renglonSelected: any;
  radioButtonSelected: any;

  foods: Food[] = [
    //divisas
    { value: '1', viewValue: 'Pesos' },
    { value: '2', viewValue: 'Dolares' },
    { value: '3', viewValue: 'Euros' },
  ];

  unidades: Unidad[] = [
    {
      value: 'P',
      viewValue: 'Pies cuadrados',
      unidadN: 'SI',
      unidadN2: 'PI',
      unidadN3: '',
      unidadN4: '',
      unidadN5: '',
    },
    {
      value: 'K',
      viewValue: 'Kilos',
      unidadN: 'SU',
      unidadN2: 'SS',
      unidadN3: '',
      unidadN4: '',
      unidadN5: '',
    },
    {
      value: 'D',
      viewValue: 'Decimetros',
      unidadN: 'SI',
      unidadN2: 'PI',
      unidadN3: '',
      unidadN4: '',
      unidadN5: '',
    },
    {
      value: 'L',
      viewValue: 'Libras',
      unidadN: 'SU',
      unidadN2: '',
      unidadN3: '',
      unidadN4: '',
      unidadN5: '',
    },
    {
      value: 'P',
      viewValue: 'Pares',
      unidadN: 'SS',
      unidadN2: '',
      unidadN3: '',
      unidadN4: '',
      unidadN5: '',
    },
    {
      value: 'U',
      viewValue: 'Unidades',
      unidadN: 'SI',
      unidadN2: 'PI',
      unidadN3: 'CI',
      unidadN4: 'CT',
      unidadN5: 'SS',
    },
    {
      value: 'M',
      viewValue: 'Metros cuadrados',
      unidadN: 'SS',
      unidadN2: '',
      unidadN3: '',
      unidadN4: '',
      unidadN5: '',
    },
  ];
  unidadesF: Unidad[] = [];

  unidadesN: UnidadNegocio[] = [
    { value: 'SI', viewValue: 'Marroquineria' },
    { value: 'SU', viewValue: 'Suela' },
    { value: 'PI', viewValue: 'Piel' },
    { value: 'CI', viewValue: 'Tiras' },
    { value: 'CT', viewValue: 'Cintos' },
    { value: 'SS', viewValue: 'Suajado' },
  ];
  selectedValue: Food;
  selectedUnidad: Unidad;
  selectedUnidadN: UnidadNegocio;
  public selectedCliente: string;
  public selectedClienteName: string;

  public Articulos: any = [];
  datos_articulo: ReqArticulos[] = [];

  datos_linea: ReqLineas[] = [];

  public Especificacion: any = [];
  datos_especificacion: any;

  public Clientes: clientRespons[] = [
    //ya se llena automaticamente
  ];

  myControl = new FormControl();

  optionsClientes: listaCliente[] = [];

  public filteredOptionsClientes: Observable<listaCliente[]> | undefined;
  nomCliente: any;
  unidadSelecc: any;
  divisaSelecc: any;

  constructor(
    private _ac: ActivatedRoute,
    private modalService: NgbModal,
    private articuloService: ArticuloService,
    private clienteService: ClienteService,
    private especificacionService: EspecificacionService,
    private aprobationService: AprobationService,
    private http: HttpClient,
    private router: Router
  ) {
    this.selectedValue = this.foods[1];
    this.selectedUnidad = this.unidades[1];
    this.selectedUnidadN = this.unidadesN[1];
    this.selectedCliente = '';
    this.selectedClienteName = '';

    this.Clientes = [];
    this.Especificacion = [];
    this.renglonSelected = null;

    /* this.grabar_localstorage(); */
  }

  ngOnDestroy(): void {}
  open(content: any, selectedItem?: any) {
    this.renglonSelected = selectedItem;
    const body = {
      ta_clta: this.renglonSelected.ta_clta,
      ta_artic: this.renglonSelected.ta_artic,
      ta_gruix: this.renglonSelected.ta_gruix,
      ta_acaba: this.renglonSelected.ta_acaba,
      ta_color: this.renglonSelected.ta_color,
      ta_clas: this.renglonSelected.ta_clas,
      ta_unifa: this.renglonSelected.ta_unifa,
      ta_divis: this.renglonSelected.ta_divis,
    };
    this.especificacionService.getEspecificacion(body).subscribe(
      (resp) => {
        this.datos_especificacion = resp.data;
      },
      (error) => console.log(error)
    );

    this.modalService.open(content, { windowClass: 'mod-class' }).result.then(
      (result) => {},
      (reason) => {}
    );
  }

  selectedUnidadNChange(values: any) {
    this.selectedUnidadN = values;
    if (values === 'SI') {
      this.isDisabledButton = true;
    } else this.isDisabledButton = false;

    this.unidadesF = this.unidades.filter(
      (u) =>
        u.unidadN == values ||
        u.unidadN2 == values ||
        u.unidadN3 == values ||
        u.unidadN4 == values ||
        u.unidadN5 == values
    );

    this.isDisableunidadM = false;
  }
  selectedUnidadMChange(values: any) {
    this.isDisableDivis = false;
  }

  selectedDivisChange(values: any) {
    this.isDisabledButtonAdd = false;
    this.isDisabledButtonBuscar = false;
  }

  ngOnInit() {
    this.aprobationService.getNombreCliente().subscribe((d) => {
      this.nomCliente = d;
    });
    this.aprobationService.getUnidadMedidda().subscribe((d) => {
      this.unidadSelecc = d;
    });
    this.aprobationService.getDivisa().subscribe((d) => {
      this.divisaSelecc = d;
    });

    console.log(this.selectedUnidad.value);
    const fds = {
      fds: "'126', '125'",
    };

    this.clienteService.getClientes(fds).subscribe(
      (resp) => {
        this.optionsClientes = resp.data;
      },
      (error) => console.log(error)
    );

    this.filteredOptionsClientes = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.c_nom)),

      map((name) =>
        name ? this._filterClientes(name) : this.optionsClientes.slice()
      )
    );
  }

  public displayFnClientes(cliente: listaCliente): string {
    return cliente && cliente.c_nom ? cliente.c_nom : '';
  }

  private _filterClientes(c_nom: string): listaCliente[] {
    const filterValue = c_nom.toLowerCase();

    return this.optionsClientes.filter(
      (option) => option.c_nom.toLowerCase().indexOf(filterValue) === 0
    );
  }

  botonbuscarArticulos() {
    const body = {
      c_codi: this.selectedCliente,
      ta_unifa: this.selectedUnidad,
      ta_divis: this.selectedValue,
      ar_tpiel: this.selectedUnidadN,
      ta_listar: this.selectedRadio ? 'S' : 'N',
    };

    this.articuloService.getArticulos(body).subscribe(
      (resp) => {
        this.datos_articulo = resp.data;
      },
      (error) => console.log(error)
    );

    if (this.datos_articulo.length == 0) {
      this.isDisabledadd = false;
    } else this.isDisabledadd = true;

    if (this.datos_articulo.length == 0) {
      this.alert = false;
    } else this.alert = true;
    this.isDisabledRadioActivo = false;
    this.isDisabledRadioInactivo = false;
  }

  closealert() {
    this.alert = false;
  }

  selectedRadio: boolean = true;
  mostrarInactivos(e: any) {
    this.selectedRadio = e.value;
    /* console.log(e);
    console.log(this.selectedRadio); */
    if (this.datos_articulo.length == 0) {
      this.alert = false;
    } else this.alert = true;
    this.botonbuscarArticulos();
  }

  codSelected(codigo: listaCliente) {
    this.selectedCliente = codigo.c_codi;
    this.isDisableunidadN = false;
    this.selectedClienteName = codigo.c_nom;
    this.aprobationService.setNombreClinte(this.selectedClienteName);
  }

  botonUpdateArticulo() {
    /* console.log(this.renglonSelected); */
    const body = {
      ta_codi: 'C',
      ta_clta: this.renglonSelected.ta_clta,
      ta_artic: this.renglonSelected.ta_artic,
      ta_gruix: this.renglonSelected.ta_gruix,
      ta_acaba: this.renglonSelected.ta_acaba,
      ta_color: this.renglonSelected.ta_color,
      ta_clas: this.renglonSelected.ta_clas,
      ta_unifa: this.renglonSelected.ta_unifa,
      ta_divis: this.renglonSelected.ta_divis,
      ta_tarif_001: this.renglonSelected.ta_tarif_001,
    };

    this.articuloService.putArticulos(body).subscribe(
      (resp) => {
        console.log(resp);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Acción realizada',
          showConfirmButton: false,
          timer: 1500,
        });
      },
      (error) => {
        console.log(error);
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Acción  no realizada',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    );
  }

  botonUpdateEspecificacion() {
    this.isDisabled = true;
    const body = {
      ef_clta: this.renglonSelected.ta_clta,
      ef_artic: this.renglonSelected.ta_artic,
      ef_gruix: this.renglonSelected.ta_gruix,
      ef_acaba: this.renglonSelected.ta_acaba,
      ef_color: this.renglonSelected.ta_color,
      ef_clas: this.renglonSelected.ta_clas,
      ef_unifa: this.renglonSelected.ta_unifa,
      ef_divis: this.renglonSelected.ta_divis,
      ef_espe1: this.datos_especificacion.ef_espe1,
      ef_espe2: this.datos_especificacion.ef_espe2,
      ef_espe3: this.datos_especificacion.ef_espe3,
      ef_espe4: this.datos_especificacion.ef_espe4,
      ef_espe5: this.datos_especificacion.ef_espe5,
      ef_espe6: this.datos_especificacion.ef_espe6,
      ef_espe7: this.datos_especificacion.ef_espe7,
      ef_espe8: this.datos_especificacion.ef_espe8,
      ef_espe9: this.datos_especificacion.ef_espe9,
      ef_espe10: this.datos_especificacion.ef_espe10,
    };
    this.especificacionService.putEspecificion(body).subscribe(
      (resp) => {
        console.log(resp);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Acción realizada',
          showConfirmButton: false,
          timer: 1500,
        });
      },
      (error) => {
        console.log(error);
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Acción  no realizada',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    );
  }

  botonAddArticulo() {
    this.aprobationService.setUnidadMedida(this.selectedUnidad);
    this.aprobationService.setDivisa(this.selectedValue);
    //codigo que necesita el servicio para agregar un articulo
  }

  filterArticulo = '';

  opensweetalertdeletArticulo(selectedItem?: any) {
    this.renglonSelected = selectedItem;
    /* console.log(this.renglonSelected); */

    Swal.fire({
      title: 'Dar de baja el artículo',

      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: `Confirmar`,
      denyButtonText: `No confirmar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        const body = {
          ta_codi: 'C',
          ta_clta: this.renglonSelected.ta_clta,
          ta_artic: this.renglonSelected.ta_artic,
          ta_gruix: this.renglonSelected.ta_gruix,
          ta_acaba: this.renglonSelected.ta_acaba,
          ta_color: this.renglonSelected.ta_color,
          ta_clas: this.renglonSelected.ta_clas,
          ta_unifa: this.renglonSelected.ta_unifa,
          ta_divis: this.renglonSelected.ta_divis,
        };

        this.articuloService.putInactivarArticulos(body).subscribe(
          (resp) => {
            console.log(resp);
          },
          (error) => console.log(error)
        );

        Swal.fire('Eliminado', '', 'success');
      } else if (result.isDenied) {
        Swal.fire('Operación no realizada', '', 'info');
      }
    });
  }

  opensweetalertActivarArticulo(selectedItem?: any) {
    this.renglonSelected = selectedItem;
    /* console.log(this.renglonSelected); */

    Swal.fire({
      title: 'Reactivar el artículo',

      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: `Confirmar`,
      denyButtonText: `No confirmar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        const body = {
          ta_codi: 'C',
          ta_clta: this.renglonSelected.ta_clta,
          ta_artic: this.renglonSelected.ta_artic,
          ta_gruix: this.renglonSelected.ta_gruix,
          ta_acaba: this.renglonSelected.ta_acaba,
          ta_color: this.renglonSelected.ta_color,
          ta_clas: this.renglonSelected.ta_clas,
          ta_unifa: this.renglonSelected.ta_unifa,
          ta_divis: this.renglonSelected.ta_divis,
        };

        this.articuloService.putActivarctivarArticulos(body).subscribe(
          (resp) => {
            console.log(resp);
          },
          (error) => console.log(error)
        );

        Swal.fire('Activado', '', 'success');
      } else if (result.isDenied) {
        Swal.fire('Operación no realizada', '', 'info');
      }
    });
  }

  /*
  grabar_localstorage(selectedItem?: any) {
    this.renglonSelected = selectedItem;

    let articulo = {
      c_codi: this.selectedCliente,
      ta_unifa: this.selectedUnidad.value,
      ta_divis: this.selectedValue.value,
      ar_tpiel: this.selectedUnidadN.value,
    };

    localStorage.setItem('articulo', JSON.stringify(articulo));
  } */
}
