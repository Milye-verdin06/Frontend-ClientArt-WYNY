import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import {
  NgbModal,
  NgbModalOptions,
  ModalDismissReasons,
} from '@ng-bootstrap/ng-bootstrap';
import { AprobationService } from 'src/app/services/Smarroquineria/aprobation.service';
import {
  clientRespons,
  listaCliente,
} from 'src/app/models/marroquineria/Cliente';
import { ArticuloService } from '../../services/Smarroquineria/articulo.service';
import { ReqArticulos, ReqLineas } from 'src/app/models/marroquineria/articulo';
import { HttpClient } from '@angular/common/http';

import { ClienteService } from 'src/app/services/cliente.service';
import { EspecificacionService } from 'src/app/services/Smarroquineria/especificacion.service';
import { authenticationService } from 'src/app/services/authentication.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { from, Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

import Swal from 'sweetalert2';

import { environment } from '../../../environments/environment';

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
  isDisabledButtonM = false; //ocultar el botton de agregar articulos marroquineria
  isDisabledButtonAddM = true; //deshabilitar boton para agregar articulo hasta que se llenen los parametros marroquineria
  isDisabledButtonS = false; //ocultar el botton de agregar articulos suela
  isDisabledButtonAddS = true; //deshabilitar boton para agregar articulo hasta que se llenen los parametros suela
  isDisabledadd = true; //deshabilitar el filtro de la descripcion del articulo
  isDisableunidadN = true; // deshabilitar la unidad de negocio y activar hasta que seleccione el cliente
  isDisableunidadM = true; // deshabilitar la unidad de medida y habilitar hasta que seleccione la unidad de negocio
  isDisableDivis = true; //deshabilitar la divisa y habilitar hasta que selecciona la unidad de medida

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
      unidadN3: 'SU',
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
  public selectedClienteC: listaCliente = {
    c_codi: '',
    c_nom: '',
  };

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
  nomDivisa: any;
  unidadNSelecc: any;
  nomUnidad: any;
  modalOption: NgbModalOptions = {};

  constructor(
    private _ac: ActivatedRoute,
    private modalService: NgbModal,
    private articuloService: ArticuloService,
    private clienteService: ClienteService,
    private especificacionService: EspecificacionService,
    private authenticationService: authenticationService,
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
    this.editTarifaForm = this.createFormGroup();

    /* this.grabar_localstorage(); */
  }

  ngOnDestroy(): void {}
  open(content: any, selectedItem?: any) {
    this.renglonSelected = selectedItem;
    this.VarAux = this.renglonSelected.ta_tarif_001;
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

    this.modalService
      .open(content, {
        windowClass: 'mod-class',
        backdrop: 'static',
        keyboard: false,
      })
      .result.then(
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
      this.isDisabledButtonAddM = true; //mantener boton inactivado
      this.isDisabledButtonM = true; //mostrar boton
      this.isDisableunidadM = false;
    } else this.isDisabledButtonM = false;

    if (values === 'SU') {
      this.isDisabledButtonS = true; //mostrar boton
      this.isDisableunidadM = false; //habilitar la unidad de medida
      this.isDisableDivis = true; //inhabilitar la divisa
    } else this.isDisabledButtonS = false;

    this.unidadesF = this.unidades.filter(
      (u) =>
        u.unidadN == values ||
        u.unidadN2 == values ||
        u.unidadN3 == values ||
        u.unidadN4 == values ||
        u.unidadN5 == values
    );

    this.aprobationService.setUnidadN(this.selectedUnidadN);

    this.selectedUnidad = {
      value: '',
      viewValue: '',
      unidadN: '',
      unidadN2: '',
      unidadN3: '',
      unidadN4: '',
      unidadN5: '',
    };
  }
  selectedUnidadMChange(values: Unidad) {
    this.selectedValue = {
      value: '',
      viewValue: '',
    };

    this.aprobationService.setUnidadN(this.selectedUnidadN);
    this.aprobationService.setUnidadMedida(this.selectedUnidad);
    this.isDisableDivis = false;
    this.isDisabledButtonAddM = true;

    /* if ((this.selectedUnidad.value = '')) {
      this.isDisabledButtonBuscar = true;
    } else this.isDisabledButtonBuscar = false; */
  }

  selectedDivisChange(values: any) {
    this.aprobationService.setDivisa(this.selectedValue);
    this.aprobationService.setNombreDivisa(this.selectedValue.viewValue);
    this.isDisabledButtonAddM = false; //activar boton agregar marroquineria
    this.isDisabledButtonAddS = false; //activar boton agregar suela
    this.isDisabledButtonBuscar = false;

    /*  if ((this.selectedValue.value = '')) {
      this.isDisabledButtonBuscar = true;
    } else this.isDisabledButtonBuscar = false; */
  }

  ngOnInit() {
    const fds = {
      fds: environment.fds,
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

    this._servicetoVar();

    this.selectedClienteC = {
      c_codi: this.codCliente,
      c_nom: this.nomCliente,
    };
    this.myControl.setValue(this.selectedClienteC);

    if (this.codCliente) {
      this.codCliente = this.selectedCliente;
    }
    if (this.unidadNSelecc) {
      this.selectedUnidadN = this.unidadNSelecc; //checar esta parte

      this.selectedUnidad = this.unidadSelecc;
      this.isDisableunidadN = false;
      this.isDisableunidadM = false;
      this.isDisabledButtonM = true;

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
      this.isDisabledButtonAddM = true;
      this.isDisabledButtonBuscar = false;
    }

    if (
      (this.codCliente == '',
      this.unidadNSelecc == '',
      this.unidadSelecc == '',
      this.divisaSelecc == '')
    ) {
    } else {
      this.botonbuscarArticulos();
    }

    if (this.divisaSelecc == this.divisaSelecc) {
      this.isDisabledButtonAddM = false;
    }
  }

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

    // console.log('cod cliente: [' + this.codCliente + ']');
    //console.log('nom cliente: [' + this.nomCliente + ']');
    //console.log('unidad Medida: [' + this.unidadSelecc + ']');
    //console.log('Divisa: [' + this.divisaSelecc + ']');
    //console.log('familia: [' + this.unidadNSelecc + ']');
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
  closealert() {
    this.alert = closed;
  }

  botonbuscarArticulos() {
    this._servicetoVar();

    const body = {
      c_codi: this.codCliente,
      ta_unifa: this.unidadSelecc,
      ta_divis: this.divisaSelecc,
      ar_tpiel: this.unidadNSelecc,
      ta_listar: this.selectedRadio ? 'S' : 'N',
    };

    this.articuloService.getArticulos(body).subscribe(
      (resp) => {
        this.datos_articulo = resp.data;
        //console.log('Datos-articulo finales', this.datos_articulo.length);
        if (this.datos_articulo.length == 0) {
          this.isDisabledadd = true;
          Swal.fire({
            icon: 'info',
            title: 'No hay artículos en la busqueda',
            showConfirmButton: false,
            timer: 1100,
          });
        } else {
          this.isDisabledadd = false;
        }
      },
      (error) => console.log(error)
    );
    //console.log('Datos-articulo finales', this.datos_articulo.length);

    /* if (this.datos_articulo.length == 0) {
      this.isDisabledadd = false;
    } else this.isDisabledadd = true;

    if (this.datos_articulo.length == 0) {
      this.alert = false;
    } else this.alert = true; */
    this.isDisabledRadioActivo = false;
    this.isDisabledRadioInactivo = false;

    this.isDisabledRadioActivo = false;
    this.isDisabledRadioInactivo = false;
    //console.log('unidadm', this.unidadSelecc);
    //console.log('divisaa', this.divisaSelecc);
  }

  selectedRadio: boolean = true;
  mostrarInactivos(e: any) {
    this.selectedRadio = e.value;

    /* if (this.datos_articulo.length == 0) {
      this.isDisabledadd = false;
    } else this.isDisabledadd = true;

    if (this.datos_articulo.length == 0) {
      this.alert = false;
    } else this.alert = true; */
    this.botonbuscarArticulos();
  }

  codSelected(codigo: listaCliente) {
    this.isDisabledButtonM = false;
    this.isDisabledButtonS = false;
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
    this.datos_articulo = [];
  }
  cerrarModEditarTarif() {
    if ((this.renglonSelected.ta_tarif_001 = this.VarAux)) {
      {
        Swal.fire({
          icon: 'info',
          title: 'Operación interrumpida',
          showConfirmButton: false,
          timer: 1000,
        });
      }
      this.modalService.dismissAll();
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Operación interrumpida',
        showConfirmButton: false,
        timer: 1000,
      });
    }
    this.modalService.dismissAll();
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
      if (this.renglonSelected.ta_tarif_001 == this.VarAux) {
        this.modalService.dismissAll();
      } else {
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
          ta_tarif_002: this.VarAux,
        };

        this.articuloService.putArticulos(body).subscribe(
          (resp) => {
            console.log(resp);
            Swal.fire({
              icon: 'success',
              title: 'Acción realizada',
              showConfirmButton: false,
              timer: 1600,
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
    this._servicetoVar();
  }

  ta_tarif_002: any;
  VarAux: any;

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

  botonAddArticuloM() {
    this.router.navigateByUrl('add-articulos-marroquineria');
  }

  botonAddArticuloS() {
    this.router.navigateByUrl('add-articulos-suela');
  }

  filterArticulo = '';

  opensweetalertdeletArticulo(selectedItem?: any) {
    this.renglonSelected = selectedItem;
    /* console.log(this.renglonSelected); */

    Swal.fire({
      title: 'Confirmar para inactivar el artículo',
      icon: 'question',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonColor: '#172b4d',
      cancelButtonColor: '#BB3939',
      confirmButtonText: `Si`,
      denyButtonText: `No`,
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

        Swal.fire({
          icon: 'success',
          title: 'Artículo inactivado correctamente',
          showConfirmButton: false,
          timer: 1700,
        });
      } else if (result.isDenied) {
        Swal.fire({
          icon: 'info',
          title: 'Operación interrumpida',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  }

  opensweetalertActivarArticulo(selectedItem?: any) {
    this.renglonSelected = selectedItem;
    /* console.log(this.renglonSelected); */

    Swal.fire({
      title: 'Confirmar para reactivar el artículo',

      showDenyButton: true,
      showCancelButton: false,
      icon: 'question',
      confirmButtonColor: '#172b4d',
      cancelButtonColor: '#BB3939',
      confirmButtonText: `Si`,
      denyButtonText: `No`,
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

        Swal.fire({
          icon: 'success',
          title: 'Artículo activado correctamente',
          showConfirmButton: false,
          timer: 1700,
        });
      } else if (result.isDenied) {
        Swal.fire({
          icon: 'info',
          title: 'Operación interrumpida',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  }
}
