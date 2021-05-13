import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AprobationService } from 'src/app/services/aprobation.service';
import { clientRespons, listaCliente } from 'src/app/models/Cliente';
import { ArticuloService } from '../../services/articulo.service';
import { ReqArticulos, ReqLineas } from 'src/app/models/articulo';
import { HttpClient } from '@angular/common/http';

import { ClienteService } from 'src/app/services/cliente.service';
import { EspecificacionService } from 'src/app/services/especificacion.service';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

import Swal from 'sweetalert2';
import { LocalStorageService } from '../../services/localStorage.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

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
  isDisabledadd = true; //deshabilitar el filtro de la descripcion del articulo
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
  createFormGroup() {
    return new FormGroup({
      Edittarifa: new FormControl('', [Validators.required]),
    });
  }
  editTarifaForm: FormGroup;

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
  codCliente: any;
  unidadSelecc: any;
  divisaSelecc: any;
  unidadNSelecc: any;

  constructor(
    private _ac: ActivatedRoute,
    private modalService: NgbModal,
    private articuloService: ArticuloService,
    private clienteService: ClienteService,
    private especificacionService: EspecificacionService,
    private aprobationService: AprobationService,
    private LocalStorageService: LocalStorageService,
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
    this.editTarifaForm = this.createFormGroup();

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
    this.selectedValue = {
      value: '',
      viewValue: '',
    };
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
    this.aprobationService.setUnidadN(this.selectedUnidadN);

    /*    if (this.selectedUnidadN.value === '') {
      this.isDisabledButtonBuscar = true;
    } else this.isDisabledButtonBuscar = false; */
  }
  selectedUnidadMChange(values: Unidad) {
    this.selectedValue = {
      value: '',
      viewValue: '',
    };
    this.aprobationService.setUnidadN(this.selectedUnidadN);
    this.aprobationService.setUnidadMedida(this.selectedUnidad);
    this.isDisableDivis = false;
    /* if ((this.selectedUnidad.value = '')) {
      this.isDisabledButtonBuscar = true;
    } else this.isDisabledButtonBuscar = false; */
  }

  selectedDivisChange(values: any) {
    console.log(this.unidadesN.length);
    this.aprobationService.setDivisa(this.selectedValue);
    this.isDisabledButtonAdd = false;
    this.isDisabledButtonBuscar = false;

    /*  if ((this.selectedValue.value = '')) {
      this.isDisabledButtonBuscar = true;
    } else this.isDisabledButtonBuscar = false; */
  }

  ngOnInit() {
    console.log('cliente service', this.codCliente);
    console.log('init Unidad Medida seleccionada', this.unidadSelecc);
    console.log('init Divisa seleccionada', this.divisaSelecc);
    console.log('init familia seleccionada', this.unidadNSelecc);

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
    this.aprobationService.getUnidadN().subscribe((d) => {
      this.unidadNSelecc = d;
    });

    if (this.codCliente) {
      this.codCliente = this.selectedCliente;
    }
    if (this.unidadNSelecc) {
      this.selectedUnidadN = this.unidadNSelecc; //checar esta parte

      this.selectedUnidad = this.unidadSelecc;
      this.isDisableunidadN = false;
      this.isDisableunidadM = false;
      this.isDisabledButton = true;

      this.unidadesF = this.unidades.filter(
        (u) =>
          u.unidadN == this.unidadNSelecc ||
          u.unidadN2 == this.unidadNSelecc ||
          u.unidadN3 == this.unidadNSelecc ||
          u.unidadN4 == this.unidadNSelecc ||
          u.unidadN5 == this.unidadNSelecc
      );
    }
    if (this.unidadSelecc) {
      this.selectedUnidad = this.unidadSelecc;
    }
    if (this.divisaSelecc) {
      this.selectedValue = this.divisaSelecc;
      this.isDisableDivis = false;
      this.isDisabledButtonAdd = false;
      this.isDisabledButtonBuscar = false;
    }
  }

  public displayFnClientes(cliente: listaCliente): string {
    /* if ((this.selectedClienteName = this.nomCliente)) {
      return this.nomCliente;
    } */
    return cliente && cliente.c_nom ? cliente.c_nom : '';
  }

  private _filterClientes(c_nom: string): listaCliente[] {
    const filterValue = c_nom.toLowerCase();

    return this.optionsClientes.filter(
      (option) => option.c_nom.toLowerCase().indexOf(filterValue) === 0
    );
  }

  botonbuscarArticulos() {
    console.log('Unidad Medida seleccionada', this.unidadSelecc);
    console.log('Divisa seleccionada', this.divisaSelecc);
    console.log('familia seleccionada', this.unidadNSelecc);

    console.log('cliente seleccionado', this.codCliente);

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
    this.alert = closed;
  }

  selectedRadio: boolean = true;
  mostrarInactivos(e: any) {
    this.selectedRadio = e.value;
    if (this.datos_articulo.length == 0) {
      this.isDisabledadd = false;
    } else this.isDisabledadd = true;
    /* console.log(e);
    console.log(this.selectedRadio); */
    if (this.datos_articulo.length == 0) {
      this.alert = false;
    } else this.alert = true;
    this.botonbuscarArticulos();
  }

  codSelected(codigo: listaCliente) {
    this.selectedCliente = codigo.c_codi;
    this.selectedClienteName = codigo.c_nom;
    this.aprobationService.setNombreClinte(this.selectedClienteName);
    this.aprobationService.setCodCliente(this.selectedCliente);
    this.isDisableunidadN = false;

    this.selectedUnidadN = {
      value: '',
      viewValue: '',
    };
    this.selectedUnidad = {
      value: '',
      viewValue: '',
      unidadN: '',
      unidadN2: '',
      unidadN3: '',
      unidadN4: '',
      unidadN5: '',
    };

    this.selectedValue = {
      value: '',
      viewValue: '',
    };
    /*  this.isDisableunidadN = false;
    this.isDisableunidadM = false;
    this.isDisableDivis = false; */
  }
  cerrarModEditarTarif() {
    if (this.renglonSelected.ta_tarif_001 === null) {
      {
        Swal.fire({
          icon: 'warning',
          title: 'Introduccir precio de venta',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } else {
      {
        Swal.fire({
          icon: 'info',
          title: 'Operación interrumpida',
          showConfirmButton: false,
          timer: 1000,
        });
      }
      this.modalService.dismissAll();
    }
  }
  botonUpdateArticulo() {
    if (this.renglonSelected.ta_tarif_001 === null) {
      {
        Swal.fire({
          icon: 'warning',
          title: 'Introduccir precio de venta',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } else {
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
            icon: 'success',
            title: 'Acción realizada',
            showConfirmButton: false,
            timer: 1700,
          });
          this.modalService.dismissAll();
        },
        (error) => {
          console.log(error);
          Swal.fire({
            icon: 'error',
            title: 'Acción  no realizada',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      );
    }
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
          icon: 'success',
          title: 'Acción realizada',
          showConfirmButton: false,
          timer: 1700,
        });
        this.modalService.dismissAll();
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
  /*  editTarifaChangue() {
    this.botonUpdateArticulo();
  } */
  botonAddArticulo() {
    this.aprobationService.setUnidadMedida(this.selectedUnidad);
    this.aprobationService.setDivisa(this.selectedValue);
    this.aprobationService.setCodCliente(this.selectedCliente);
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
        Swal.fire('Operación interrumpida', '', 'info');
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
        Swal.fire('Operación interrumpida', '', 'info');
      }
    });
  }
}
