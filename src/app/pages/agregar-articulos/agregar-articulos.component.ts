import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input, Pipe, ContentChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Resolve,
  Router,
} from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {
  ReqLineas,
  ReqFormatos,
  ReqTamanos,
  ReqGrosores,
  ReqColores,
  AcabadosRespons,
  ReqArticulos,
} from 'src/app/models/articulo';
import { ArticuloService } from 'src/app/services/articulo.service';

import { ClienteService } from '../../services/cliente.service';
import { AprobationService } from 'src/app/services/aprobation.service';
import { Location } from '@angular/common';
import { Observable, of } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { ColorRespons, ReqAcabados } from '../../models/articulo';

import {
  MatAutocomplete,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
import Swal from 'sweetalert2';
import { EspecificacionService } from 'src/app/services/especificacion.service';
import { ReqEspecificaciones } from '../../models/especificacion';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Content } from '@angular/compiler/src/render3/r3_ast';

interface Tambor {
  value: string;
  viewValue: string;
}
interface Acabado {
  value: string;
  viewValue: string;
}

interface Tamano {
  value: string;
  viewValue: string;
}

interface Clasificado {
  value: string;
}

@Component({
  selector: 'app-agregar-articulos',
  templateUrl: './agregar-articulos.component.html',
})
export class AgregarArticulosComponent implements OnInit {
  datos_articulo: ReqArticulos[] = [];
  datos_especificacion: any;
  myControls: FormControl[] = [new FormControl('')];
  myControl2: FormControl[] = [new FormControl('')];

  isDisabledTambor = true; //deshabilitar el select de tambor hasta que seleccionen la familia
  isDisabledFormato = true; //deshabilitar el select de formato hasta que seleccionen el tambor
  isDisabledTamano = true; //deshabilitar el select de tamano hasta que seleccionen el formato
  isDisabledGrosor = true; //deshabilitar el select de grosor hasta que seleccionen el tamano
  isDisabledClasificado = true; //deshabilitar el select de clasificado hasta que seleccionen el grosor
  isDisabledAcabado = true; //deshabilitar el select de acabado hasta que seleccionen el clasificado
  isDisabledAutoCompleteC = false; //deshabilitar el autocomplete de colores
  isDisabledAutoCompleteA = false; //deshabilitar el autocomplete de acabados
  isDisabledButtonEspe = false; //deshabilitar el botton de agregar especificaciones

  public Articulos: any = [];
  public datos_linea: ReqLineas[] = [];
  public datos_formato: ReqFormatos[] = [];
  public datos_tamano: ReqTamanos[] = [];
  public datos_grosor: ReqGrosores[] = [];
  public datos_color: ReqColores[] = [];
  public datos_acabados: ReqAcabados[] = [];

  nomCliente: any;
  codCliente: any;
  unidadSelecc: any;
  divisaSelecc: any;
  unidadNSelecc: any;

  createFormGroup() {
    return new FormGroup({
      /*  linea: new FormControl('', [Validators.required]),
      tambor: new FormControl('', [Validators.required]),
      formato: new FormControl('', [Validators.required]),
      tamaño: new FormControl('', [Validators.required]),
      clasificado: new FormControl('', [Validators.required]),
      grosor: new FormControl('', [Validators.required]), */
      // color: new FormControl('', [Validators.required]),
      //acabado: new FormControl('', [Validators.required]),
      tarifa: new FormControl('', [Validators.required]),
      //listar: new FormControl('', [Validators.required]),
    });
  }
  createFormGroupp() {
    return new FormGroup({
      color: new FormControl('', [Validators.required]),
      acabado: new FormControl('', [Validators.required]),
    });
  }

  articuloForm: FormGroup;

  tambor: Tambor[] = [
    { value: 'L', viewValue: 'LISO' },
    { value: 'T', viewValue: 'TAMBOREADO' },
    { value: 'M', viewValue: 'MUY TAMBOREADO' },
  ];

  acabado: Acabado[] = [
    { value: 'NA', viewValue: 'NATURAL' },
    { value: 'TC', viewValue: 'TENIDO' },
    { value: 'UI', viewValue: 'ACABADO' },
  ];
  formatos: ReqFormatos[] = [];

  tamanos: ReqTamanos[] = [];

  clasificado: Clasificado[] = [
    { value: 'A' },
    { value: 'B' },
    { value: 'C' },
    { value: 'D' },
  ];
  grosores: ReqGrosores[] = [];

  public Acabados: AcabadosRespons[] = [];
  optionsAcabados: ReqAcabados[] = [];
  public filteredOptionsAcabados: Observable<ReqAcabados[]>[] = [];

  public Colores: ColorRespons[] = [];
  optionsColores: ReqColores[] = [];
  public filteredOptionsColores: Observable<ReqColores[]>[] = [];
  public filteredOptionsCOlores2: Observable<ReqColores> | undefined;

  public selectedAcabadosCodi: ReqAcabados;
  public selectedAcabadoName: string;
  public selectedColores: ReqColores;
  public selectedColorName: string;

  selectedLinea: ReqLineas;
  selectedTambor: Tambor;
  selectedFormato: ReqFormatos;
  selectedTamano: ReqTamanos;
  selectedGrosor: ReqGrosores;
  selectedClasificado: Clasificado;

  selectedAcabado: Acabado;

  constructor(
    private location: Location,
    private articuloService: ArticuloService,
    private especificacionService: EspecificacionService,
    private ClienteService: ClienteService,
    private aprobationService: AprobationService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private aRouter: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {
    this.selectedLinea = this.datos_linea[1];
    this.selectedTambor = this.tambor[1];
    this.selectedFormato = this.datos_formato[1];
    this.selectedTamano = this.datos_tamano[1];
    this.selectedClasificado = this.clasificado[1];
    this.selectedGrosor = this.datos_grosor[1];
    this.selectedAcabado = this.acabado[1];

    this.selectedAcabadosCodi = {
      ac_codi: '',
      ac_desce: '',
    };
    this.selectedAcabadoName = '';
    this.Acabados = [];

    this.selectedColores = {
      co_codi: '',
      co_desce: '',
    };
    this.selectedColorName = '';
    this.Colores = [];

    this.articuloForm = this.createFormGroup();
  }

  open(content: any) {
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

  ngOnInit() {
    this.aprobationService.getNombreCliente().subscribe((d) => {
      this.nomCliente = d;
    });
    this.aprobationService.getCodCliente().subscribe((d) => {
      this.codCliente = d;
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

    this.ClienteService.getClientes;

    this.articuloService.getlinea().subscribe(
      (resp) => {
        this.datos_linea = resp.data;
      },
      (error) => console.log(error)
    );

    this.articuloService.getformato().subscribe(
      (resp) => {
        this.datos_formato = resp.data;
      },
      (error) => console.log(error)
    );

    this.articuloService.gettamano().subscribe(
      (resp) => {
        this.datos_tamano = resp.data;
      },
      (error) => console.log(error)
    );

    this.articuloService.getgrosor().subscribe(
      (resp) => {
        this.datos_grosor = resp.data;
      },
      (error) => console.log(error)
    );

    this.articuloService.getAcabado().subscribe(
      (resp) => {
        this.optionsAcabados = resp.data;
      },
      (error) => console.log(error)
    );

    this.filteredOptionsAcabados.push(
      this.myControls[0].valueChanges.pipe(
        startWith(''),
        map((value) => (typeof value === 'string' ? value : value.ac_codi)),
        map((name) =>
          name ? this._filterAcabados(name) : this.optionsAcabados.slice()
        )
      )
    );

    this.articuloService.getcolor().subscribe(
      (resp) => {
        this.optionsColores = resp.data;
      },
      (error) => console.log(error)
    );
    this.filteredOptionsColores.push(
      this.myControl2[0].valueChanges.pipe(
        startWith(''),
        map((value) => (typeof value === 'string' ? value : value.co_codi)),
        map((name) =>
          name ? this._filterColores(name) : this.optionsColores.slice()
        )
      )
    );

    console.log('codigo cliente seleccionado', this.codCliente);
  }

  public displayFnAcabados(acabado: ReqAcabados): string {
    return acabado && String(acabado.ac_desce).trim()
      ? String(acabado.ac_desce).trim()
      : '';
  }

  private _filterAcabados(ac_desce: string): ReqAcabados[] {
    const filterValue = ac_desce.toLowerCase();

    return this.optionsAcabados.filter(
      (option) => option.ac_desce.toLowerCase().indexOf(filterValue) === 0
    );
  }

  codSelected(codigoA: ReqAcabados) {
    this.selectedAcabadosCodi = {
      ac_codi: codigoA.ac_codi,
      ac_desce: codigoA.ac_desce,
    };
    this.selectedAcabadoName = codigoA.ac_desce;

    this.mostrarInfo();
    this.mostrarCodigo();
    console.log(this.selectedAcabadosCodi.ac_codi);
  }
  public displayFnColores(color: ReqColores): string {
    return color && String(color.co_desce).trim()
      ? String(color.co_desce).trim()
      : '';
  }

  private _filterColores(co_desce: string): ReqColores[] {
    const filterValueC = co_desce.toLowerCase();

    return this.optionsColores.filter(
      (option) => option.co_desce.toLowerCase().indexOf(filterValueC) === 0
    );
  }
  codSelectedColores(
    codigo: ReqColores,
    trigger: MatAutocompleteTrigger,
    auto: MatAutocomplete
  ) {
    this.selectedColores = {
      co_codi: codigo.co_codi,
      co_desce: codigo.co_desce,
    };

    this.selectedColorName = codigo.co_desce;

    this.mostrarInfo();
    this.mostrarCodigo();
  }

  selectedLineaNChange(values: ReqLineas) {
    if (this.selectedLinea.tp_codi === String('CS').trim()) {
      this.isDisabledTamano = false;
    } else this.isDisabledTamano = true;

    this.formatos = this.datos_formato.filter(
      (u) => u.ft_tpiel == String(values.tp_codi).trim()
    );
    this.isDisabledTambor = false;
    if (this.formatos.length < 1) {
      this.formatoSeleccionado = undefined;
    }

    this.tamanos = this.datos_tamano.filter(
      (u) => u.tm_tpiel == String(values.tp_codi).trim()
    );

    this.grosores = this.datos_grosor.filter(
      (u) => u.gl_linea == String(values.tp_codi).trim()
    );

    this.selectedTambor = {
      value: '',
      viewValue: '',
    };
    this.selectedFormato = {
      ft_tpiel: '',
      ft_codi: '',
      ft_desc: '',
      ft_desci: '',
      ft_sts: '',
    };
    this.selectedTamano = {
      tm_tpiel: '',
      tm_codi: '',
      tm_desc: '',
      tm_sts: '',
    };
    this.selectedGrosor = {
      gl_linea: '',
      gl_codi: '',
      gl_desc: '',
    };
    this.selectedClasificado = {
      value: '',
    };
    this.selectedAcabado = {
      value: '',
      viewValue: '',
    };
    this.selectedColores = {
      co_codi: '',
      co_desce: '',
    };
    this.selectedAcabadosCodi = {
      ac_codi: '',
      ac_desce: '',
    };

    this.mostrarInfo();
    this.mostrarCodigo();
  }

  selectTamborChangue(values: Tambor) {
    this.isDisabledFormato = false;

    this.selectedFormato = {
      ft_tpiel: '',
      ft_codi: '',
      ft_desc: '',
      ft_desci: '',
      ft_sts: '',
    };
    this.selectedTamano = {
      tm_tpiel: '',
      tm_codi: '',
      tm_desc: '',
      tm_sts: '',
    };
    this.selectedGrosor = {
      gl_linea: '',
      gl_codi: '',
      gl_desc: '',
    };
    this.selectedClasificado = {
      value: '',
    };
    this.selectedAcabado = {
      value: '',
      viewValue: '',
    };
    this.selectedColores = {
      co_codi: '',
      co_desce: '',
    };
    this.selectedAcabadosCodi = {
      ac_codi: '',
      ac_desce: '',
    };
    this.mostrarInfo();
    this.mostrarCodigo();

    if (this.formatos.length == 0) {
      this.isDisabledTamano = false;

      if (this.tamanos.length == 0) {
        this.isDisabledGrosor = false;
      }
    }
  }

  formatoSeleccionado: any;
  selectFormatoChangue(values: ReqFormatos) {
    this.formatoSeleccionado = values.ft_codi;
    if (
      String(this.selectedLinea.tp_codi).trim() == 'SI' ||
      String(this.selectedLinea.tp_codi).trim() == 'AZ'
    )
      if (this.selectedFormato.ft_codi == 'P') {
        this.tamanos = this.datos_tamano.filter(
          (t) =>
            t.tm_sts == 'B' &&
            t.tm_tpiel == String(this.selectedLinea.tp_codi).trim()
        );
      } else {
        this.tamanos = [];
      }
    else {
      this.tamanos = this.datos_tamano.filter(
        (t) =>
          String(t.tm_tpiel).trim() == String(this.selectedLinea.tp_codi).trim()
      );
    }

    this.selectedTamano = {
      tm_tpiel: '',
      tm_codi: '',
      tm_desc: '',
      tm_sts: '',
    };
    this.selectedGrosor = {
      gl_linea: '',
      gl_codi: '',
      gl_desc: '',
    };
    this.selectedClasificado = {
      value: '',
    };
    this.selectedAcabado = {
      value: '',
      viewValue: '',
    };
    this.selectedColores = {
      co_codi: '',
      co_desce: '',
    };
    this.selectedAcabadosCodi = {
      ac_codi: '',
      ac_desce: '',
    };
    this.mostrarInfo();
    this.mostrarCodigo();
    this.isDisabledTamano = false;

    if (this.tamanos.length == 0) {
      this.isDisabledGrosor = false;
    }
  }
  selectTamanoChangue(values: Tamano) {
    this.selectedGrosor = {
      gl_linea: '',
      gl_codi: '',
      gl_desc: '',
    };
    this.selectedClasificado = {
      value: '',
    };
    this.selectedAcabado = {
      value: '',
      viewValue: '',
    };
    this.selectedColores = {
      co_codi: '',
      co_desce: '',
    };
    this.selectedAcabadosCodi = {
      ac_codi: '',
      ac_desce: '',
    };
    this.isDisabledGrosor = false;

    this.mostrarInfo();
    this.mostrarCodigo();
  }

  selectGrosorChangue(values: any) {
    this.isDisabledAcabado = false;

    this.selectedClasificado = {
      value: '',
    };
    this.selectedAcabado = {
      value: '',
      viewValue: '',
    };
    this.selectedColores = {
      co_codi: '',
      co_desce: '',
    };
    this.selectedAcabadosCodi = {
      ac_codi: '',
      ac_desce: '',
    };

    this.mostrarInfo();
    this.mostrarCodigo();
  }

  selectAcabadoChangue(values: any) {
    this.isDisabledClasificado = false;
    this.selectedAcabadosCodi = {
      ac_codi: '',
      ac_desce: '',
    };

    this.selectedColores = {
      co_codi: '',
      co_desce: '',
    };
    this, this.myControl2[0].setValue(this.selectedColores);
    this, this.myControls[0].setValue(this.selectedAcabadosCodi);

    if (this.selectedAcabado.value === 'TC') {
      this.isDisabledAutoCompleteC = true;
      this.isDisabledAutoCompleteA = false;

      this.selectedColores = {
        co_codi: '',
        co_desce: '',
      };
      this.selectedAcabadosCodi = {
        ac_codi: '',
        ac_desce: '',
      };
    } else {
      if (this.selectedAcabado.value === 'UI') {
        this.isDisabledAutoCompleteC = true;
        this.isDisabledAutoCompleteA = true;
      } else {
        this.selectedColores = {
          co_codi: '',
          co_desce: '',
        };
        this.selectedAcabadosCodi = {
          ac_codi: '',
          ac_desce: '',
        };

        (this.isDisabledAutoCompleteA = false),
          (this.isDisabledAutoCompleteC = false);
      }
    }

    this.isDisabledGrosor = false;
    this.mostrarInfo();
    this.mostrarCodigo();
  }
  selectClasificadoChangue(values: Clasificado) {
    this.mostrarInfo();
    this.mostrarCodigo();

    this.isDisabledButtonEspe = true;
  }
  infoCodi: string = '';
  infoDesc: string = '';
  infoLinea: string = '';
  infoTambor: string = '';
  infoFormato: string = '';
  infoTamano: string = '';
  infoGrosor: string = '';
  infoClasificado: string = '';
  infoAcabadoselect: string = '';
  infoColor: string = '';
  infoAcabadofilter: string = '';

  mostrarInfo() {
    this.infoLinea = this.selectedLinea
      ? String(this.selectedLinea.tp_desc)
          .trim()
          .substring(2, String(this.selectedLinea.tp_desc).trim().length)
      : '';
    this.infoTambor = this.selectedTambor
      ? String(this.selectedTambor.viewValue).trim()
      : '';
    if (this.selectedLinea.tp_codi && this.selectedTambor.value) {
      this.infoFormato = this.selectedFormato.ft_desci
        ? String(this.selectedFormato.ft_desc).trim()
        : ' ';
    } else {
      this.infoFormato = '';
    }
    if (this.selectedLinea.tp_codi && this.selectedTambor.value) {
      this.infoTamano = this.selectedTamano.tm_desc
        ? String(this.selectedTamano.tm_desc).trim()
        : ' ';
    } else {
      this.infoTamano = '';
    }
    this.infoGrosor = this.selectedGrosor
      ? String(this.selectedGrosor.gl_desc).trim()
      : ' ';
    this.infoAcabadofilter = this.selectedAcabadosCodi.ac_codi
      ? String(this.selectedAcabadoName).trim()
      : '';
    this.infoAcabadoselect = this.selectedAcabado.viewValue
      ? String(this.selectedAcabado.viewValue).trim()
      : '';
    this.infoColor = this.selectedColores.co_codi
      ? String(this.selectedColorName).trim()
      : '';
    this.infoClasificado = this.selectedClasificado //mostrar el valor del mat-selected NATURAL 'NA' TENIDO 'TC'
      ? String(this.selectedClasificado.value).trim()
      : ' ';

    if (this.selectedAcabado.value === 'UI') {
      this.infoDesc =
        this.infoLinea +
        ' ' +
        this.infoTambor +
        ' ' +
        this.infoFormato +
        ' ' +
        this.infoTamano +
        ' ' +
        this.infoGrosor +
        ' ' +
        this.infoAcabadofilter +
        ' ' +
        this.infoColor +
        ' ' +
        this.infoClasificado;
    } else {
      this.infoDesc =
        this.infoLinea +
        ' ' +
        this.infoTambor +
        ' ' +
        this.infoFormato +
        ' ' +
        this.infoTamano +
        ' ' +
        this.infoGrosor +
        ' ' +
        this.infoAcabadoselect +
        ' ' +
        this.infoColor +
        ' ' +
        this.infoClasificado;
    }
  }

  mostrarCodigo() {
    this.infoLinea = this.selectedLinea
      ? String(this.selectedLinea.tp_desc).trim().substr(-20, 1)
      : '';
    this.infoTambor = this.selectedTambor
      ? String(this.selectedTambor.value).trim()
      : '';
    if (this.selectedLinea.tp_codi && this.selectedTambor.value) {
      this.infoFormato = this.selectedFormato.ft_codi
        ? String(this.selectedFormato.ft_codi).trim()
        : 'X';
    } else {
      this.infoFormato = '';
    }
    if (this.selectedLinea.tp_codi && this.selectedTambor.value) {
      this.infoTamano = this.selectedTamano.tm_codi
        ? String(this.selectedTamano.tm_codi).trim()
        : 'X';
    } else {
      this.infoTamano = '';
    }
    this.infoGrosor = this.selectedGrosor
      ? String(this.selectedGrosor.gl_codi).trim()
      : '';

    this.infoAcabadoselect = this.selectedAcabado
      ? String(this.selectedAcabado.value).trim()
      : '';
    this.infoAcabadofilter = this.selectedAcabadosCodi.ac_codi
      ? String(this.selectedAcabadosCodi.ac_codi).trim()
      : '';
    this.infoColor = this.selectedColores.co_codi
      ? String(this.selectedColores.co_codi).trim()
      : '';
    this.infoClasificado = this.selectedClasificado
      ? String(this.selectedClasificado.value).trim()
      : '';

    if (this.selectedAcabado.value === 'UI') {
      this.infoCodi =
        this.infoLinea +
        '' +
        this.infoTambor +
        '' +
        this.infoFormato +
        '' +
        this.infoTamano +
        ' ' +
        this.infoGrosor +
        ' ' +
        this.infoAcabadofilter +
        ' ' +
        this.infoColor +
        ' ' +
        this.infoClasificado;
    } else {
      this.infoCodi =
        this.infoLinea +
        '' +
        this.infoTambor +
        '' +
        this.infoFormato +
        '' +
        this.infoTamano +
        ' ' +
        this.infoGrosor +
        ' ' +
        this.infoAcabadoselect +
        ' ' +
        this.infoColor +
        ' ' +
        this.infoClasificado;
    }
  }

  onChange() {}
  public useDefault = false;
  toggle(event: MatSlideToggleChange) {
    console.log('Toggle fired');
    this.useDefault = event.checked;
  }
  AddTarifa: any;

  onResetForm() {
    //eliminar contenido del formulario
    this.articuloForm.reset();
  }

  submitArticulo() {
    /*  console.log('codigoo', this.infoCodi.substring(0, 4));
    console.log('Unidad Medida seleccionada', this.unidadSelecc);
    console.log('Divisa seleccionada', this.divisaSelecc);
    console.log('familia seleccionada', this.unidadNSelecc);
    console.log('codigo cliente seleccionado', this.codCliente);
    console.log('cliente seleccionado', this.nomCliente); */

    if (this.articuloForm.invalid) {
      {
        Swal.fire({
          icon: 'warning',
          title: 'Introducir campos requeridos *',
          showConfirmButton: false,
          timer: 1700,
        });
      }
    } else {
      {
        Swal.fire({
          icon: 'success',
          title: '¡Registro exitoso!',
          showDenyButton: true,
          confirmButtonText: 'Agregar Especificación',
        }).then((result) => {
          if (result.isConfirmed) {
          }
        });
      }
    }

    /* else {
      console.log('form lleno');
      console.log(this.AddTarifa);
      Swal.fire({
        title: 'Confirmar registro del articulo',
        text: this.infoDesc,
        showDenyButton: true,
        icon: 'success',
        showCancelButton: false,
        confirmButtonText: `Confirmar`,
        denyButtonText: `No confirmar`,
      }).then((result) => { */
    //codigo listo para addArticulo
    /* if (result.isConfirmed) {
          if (this.selectedAcabado.value == 'NA') {
            const body = {
              ta_codi: 'C',
              ta_clta: this.codCliente,
              ta_artic: this.infoCodi.substring(0, 4),
              ta_gruix: this.selectedGrosor.gl_codi,
              ta_acaba: 'NA',
              ta_color: '9',
              ta_clas: this.selectedClasificado.value,
              ta_unifa: this.unidadSelecc,
              ta_divis: this.divisaSelecc,
              ta_tarif_001: this.AddTarifa,
              ta_tarif_002: '',
              ta_tarif_003: '',
              ta_tarif_004: '',
              ta_listar: 'S',
            };
            this.articuloService.postArticulos(body).subscribe(
              (resp) => {
                this.datos_articulo = resp.data;

                Swal.fire({
                  icon: 'success',
                  title: '¡Registro exitoso!',

                  timer: 1500,
                });
              },
              (error) => console.log(error)
            );
          } //termina primer if NATURAL

          //else del primer if
          else {
            if (this.selectedAcabado.value == 'TC') {
              if (this.selectedColores.co_codi == '') {
                Swal.fire({
                  icon: 'warning',
                  title: 'Introducir el color',

                  timer: 1500,
                });
              } else {
                const body = {
                  ta_codi: 'C',
                  ta_clta: this.codCliente,
                  ta_artic: this.infoCodi.substring(0, 4),
                  ta_gruix: this.selectedGrosor.gl_codi,
                  ta_acaba: 'TC',
                  ta_color: this.selectedColores.co_codi,
                  ta_clas: this.selectedClasificado.value,
                  ta_unifa: this.unidadSelecc,
                  ta_divis: this.divisaSelecc,
                  ta_tarif_001: this.AddTarifa,
                  ta_tarif_002: '',
                  ta_tarif_003: '',
                  ta_tarif_004: '',
                  ta_listar: 'S',
                };
                this.articuloService.postArticulos(body).subscribe(
                  (resp) => {
                    this.datos_articulo = resp.data;
                    {
                      Swal.fire({
                        icon: 'success',
                        title: 'Registro exitoso',
                        showConfirmButton: false,
                        timer: 1500,
                      });
                    }
                  },
                  (error) => console.log(error)
                );
              }
            } else {
              if (this.selectedAcabado.value == 'UI') {
                if (
                  (this.selectedColores.co_codi == '',
                  (this.selectedColores.co_codi = ''))
                ) {
                  Swal.fire({
                    icon: 'warning',
                    title: 'Introducir acabado y color',

                    timer: 1500,
                  });
                } else {
                  const body = {
                    ta_codi: 'C',
                    ta_clta: this.codCliente,
                    ta_artic: this.infoCodi.substring(0, 4),
                    ta_gruix: this.selectedGrosor.gl_codi,
                    ta_acaba: this.selectedColores.co_codi,
                    ta_color: this.selectedColores.co_codi,
                    ta_clas: this.selectedClasificado.value,
                    ta_unifa: this.unidadSelecc,
                    ta_divis: this.divisaSelecc,
                    ta_tarif_001: this.AddTarifa,
                    ta_tarif_002: '',
                    ta_tarif_003: '',
                    ta_tarif_004: '',
                    ta_listar: 'S',
                  };
                  this.articuloService.postArticulos(body).subscribe(
                    (resp) => {
                      this.datos_articulo = resp.data;
                      {
                        Swal.fire({
                          icon: 'success',
                          title: 'Registro exitoso',
                          showConfirmButton: false,
                          timer: 1500,
                        });
                      }
                    },
                    (error) => console.log(error)
                  );
                }
              }
            }

            //añadir codigo del postArticulo
            Swal.fire('Articulo registrado correctamente', '', 'success');
            this.onResetForm();
            this.isHomeRoute();
          }
        } else if (result.isDenied) {
          Swal.fire('Registro cancelado', '', 'info');
        }
      });
    } */
  }

  opensweetalertCancelaRegistroArticulo(selectedItem?: any) {
    Swal.fire({
      title: '¿Cancelar registro del articulo?',

      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
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
            icon: 'info',
            title: 'Registro de articulo cancelado',
            showConfirmButton: false,
            timer: 1600,
          });
        }

        this.isHomeRoute();
      }
    });
  }

  isHomeRoute() {
    //dirigirse al componente principal cuando cancelan el registro de un articulo.
    this.router.navigate(['/articulos-cliente']);
  }
  Addespeci1: any;
  Addespeci2: any;
  Addespeci3: any;
  Addespeci4: any;
  Addespeci5: any;
  Addespeci6: any;
  Addespeci7: any;
  Addespeci8: any;
  Addespeci9: any;
  Addespeci10: any;

  BottonAddEspecificacion() {
    console.log(this.Addespeci1, 'especificacions');

    /* if (this.selectedAcabado.value == 'NA') {

      const body = {
      ef_clta: this.codCliente,
      ef_artic: this.infoCodi.substring(0, 4),
      ef_gruix: this.selectedGrosor.gl_codi,
      ef_acaba: 'NA',
      ef_color: '9',
      ef_clas: this.selectedClasificado.value,
      ef_unifa: this.unidadSelecc,
      ef_divis: this.divisaSelecc,
      ef_espe1: this.Addespeci1,
      ef_espe2: this.Addespeci2,
      ef_espe3: this.Addespeci3,
      ef_espe4: this.Addespeci4,
      ef_espe5: this.Addespeci5,
      ef_espe6: this.Addespeci6,
      ef_espe7: this.Addespeci7,
      ef_espe8: this.Addespeci8,
      ef_espe9: this.Addespeci9,
      ef_espe10: this.Addespeci10,
    };
            this.especificacionService.postEspecificacion(body).subscribe(
     (resp) => {
       this.datos_especificacion = resp.data;

    Swal.fire({
      icon: 'success',
      title: '¡Registro exitoso!',

      timer: 1500,
    });


              },
              (error) => console.log(error)
            );
          } //termina primer if NATURAL

          //else del primer if
          else {
            if (this.selectedAcabado.value == 'TC') {

               const body = {
      ef_clta: this.codCliente,
      ef_artic: this.infoCodi.substring(0, 4),
      ef_gruix: this.selectedGrosor.gl_codi,
      ef_acaba: 'TC',
      ef_color: this.selectedColores.co_codi,
      ef_clas: this.selectedClasificado.value,
      ef_unifa: this.unidadSelecc,
      ef_divis: this.divisaSelecc,
      ef_espe1: this.Addespeci1,
      ef_espe2: this.Addespeci2,
      ef_espe3: this.Addespeci3,
      ef_espe4: this.Addespeci4,
      ef_espe5: this.Addespeci5,
      ef_espe6: this.Addespeci6,
      ef_espe7: this.Addespeci7,
      ef_espe8: this.Addespeci8,
      ef_espe9: this.Addespeci9,
      ef_espe10: this.Addespeci10,
    };



               this.especificacionService.postEspecificacion(body).subscribe(
     (resp) => {
       this.datos_especificacion = resp.data;
                  {
                    Swal.fire({
                      icon: 'success',
                      title: 'Registro exitoso',
                      showConfirmButton: false,
                      timer: 1500,
                    });
                  }
                },
                (error) => console.log(error)
              );
            } else {
              if (this.selectedAcabado.value == 'UI') {
                 const body = {
      ef_clta: this.codCliente,
      ef_artic: this.infoCodi.substring(0, 4),
      ef_gruix: this.selectedGrosor.gl_codi,
      ef_acaba: this.selectedAcabadosCodi.ac_codi,
      ef_color: this.selectedColores.co_codi,
      ef_clas: this.selectedClasificado.value,
      ef_unifa: this.unidadSelecc,
      ef_divis: this.divisaSelecc,
      ef_espe1: this.Addespeci1,
      ef_espe2: this.Addespeci2,
      ef_espe3: this.Addespeci3,
      ef_espe4: this.Addespeci4,
      ef_espe5: this.Addespeci5,
      ef_espe6: this.Addespeci6,
      ef_espe7: this.Addespeci7,
      ef_espe8: this.Addespeci8,
      ef_espe9: this.Addespeci9,
      ef_espe10: this.Addespeci10,
    };

                 this.especificacionService.postEspecificacion(body).subscribe(
     (resp) => {
       this.datos_especificacion = resp.data;
                    {
                      Swal.fire({
                        icon: 'success',
                        title: 'Registro exitoso',
                        showConfirmButton: false,
                        timer: 1500,
                      });
                    }
                  },
                  (error) => console.log(error)
                );
              }
            }
          }
 */
    // this.modalService.dismissAll(); checar si cerrarlo o asi dejarlo por un momento para corroborar lo que se guardo
  }
}
