import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input, Pipe } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Resolve,
  Router,
} from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
  myControls: FormControl[] = [new FormControl('')];

  isDisabledTambor = true; //deshabilitar el select de tambor hasta que seleccionen la familia
  isDisabledFormato = false; //deshabilitar el select de formato hasta que seleccionen el tambor
  isDisabledTamano = false; //deshabilitar el select de tamano hasta que seleccionen el formato
  isDisabledGrosor = true; //deshabilitar el select de grosor hasta que seleccionen el tamano
  isDisabledClasificado = true; //deshabilitar el select de clasificado hasta que seleccionen el grosor
  isDisabledAcabado = true; //deshabilitar el select de acabado hasta que seleccionen el clasificado
  isDisabledAutoCompleteC = false; //deshabilitar el autocomplete de colores
  isDisabledAutoCompleteA = false; //deshabilitar el autocomplete de acabados
  public Articulos: any = [];
  public datos_linea: ReqLineas[] = [];
  public datos_formato: ReqFormatos[] = [];
  public datos_tamano: ReqTamanos[] = [];
  public datos_grosor: ReqGrosores[] = [];
  public datos_color: ReqColores[] = [];
  public datos_acabados: ReqAcabados[] = [];

  nomCliente: any;
  unidadSelecc: any;
  divisaSelecc: any;

  articuloForm: FormGroup;
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  tambor: Tambor[] = [
    { value: 'L', viewValue: 'LISO' },
    { value: 'T', viewValue: 'TAMBOREADO' },
    { value: 'M', viewValue: 'MUY TAMBOREADO' },
  ];

  acabado: Acabado[] = [
    { value: 'NA', viewValue: 'NATURAL' },
    { value: 'TE', viewValue: 'TENIDO' },
    { value: 'AC', viewValue: 'ACABADO' },
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

  public selectedAcabadosCodi: string;
  public selectedAcabadoName: string;
  public selectedColores: string;
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
    this.selectedAcabadosCodi = '';
    this.selectedAcabadoName = '';
    this.Acabados = [];
    this.selectedColores = '';
    this.selectedColorName = '';
    this.Colores = [];

    this.articuloForm = this.fb.group({
      linea: ['', Validators.required],
      tambor: ['', Validators.required],
      formato: ['', Validators.required],
      tamaño: ['', Validators.required],
      clasificado: ['', Validators.required],
      grosor: ['', Validators.required],
      color: ['', Validators.required],
      acabado: ['', Validators.required],
      tarifa: ['', Validators.required],
      //listar: ['', Validators.required],
    });
  }

  open(content: any) {
    this.modalService.open(content, { windowClass: 'mod-class' }).result.then(
      (result) => {},
      (reason) => {}
    );
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
      this.myControls[0].valueChanges.pipe(
        startWith(''),
        map((value) => (typeof value === 'string' ? value : value.co_codi)),
        map((name) =>
          name ? this._filterColores(name) : this.optionsColores.slice()
        )
      )
    );
    console.log('Unidad Medida seleccionada', this.unidadSelecc);
    console.log('Divisa seleccionada', this.divisaSelecc);
  }

  public displayFnAcabados(acabado: ReqAcabados): string {
    return acabado && acabado.ac_desce ? acabado.ac_desce : '';
  }

  private _filterAcabados(ac_desce: string): ReqAcabados[] {
    const filterValue = ac_desce.toLowerCase();

    return this.optionsAcabados.filter(
      (option) => option.ac_desce.toLowerCase().indexOf(filterValue) === 0
    );
  }

  codSelected(codigoA: ReqAcabados) {
    this.selectedAcabadosCodi = codigoA.ac_codi;
    this.selectedAcabadoName = codigoA.ac_desce;
    this.mostrarInfo();
    this.mostrarCodigo();
  }
  public displayFnColores(color: ReqColores): string {
    return color && color.co_desce ? color.co_desce : '';
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
    auto: MatAutocomplete,
    index: number
  ) {
    this.selectedColores = codigo.co_codi;

    this.selectedColorName = codigo.co_desce;
    this.mostrarInfo();
    this.mostrarCodigo();

    /* setTimeout((x) => {
      auto.options.forEach((item) => {
        item.deselect();
      });
      this.myControls[index].reset('');
      trigger.openPanel();
    }, 100); */
  }

  selectedLineaNChange(values: ReqLineas) {
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
    this.selectedColores = '';
    this.selectedAcabadosCodi = '';
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
    this.selectedColores = '';
    this.selectedAcabadosCodi = '';
    this.mostrarInfo();
    this.mostrarCodigo();
  }

  infoCodi: string = '';
  infoDesc: string = '';
  infoLinea: string = '';
  infoTambor: string = '';
  infoFormato: string = '';
  infoTamano: string = '';
  infoGrosor: string = '';
  infoClasificado: string = '';
  infoAcabadoselect: any;
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
    this.infoFormato = this.selectedFormato
      ? String(this.selectedFormato.ft_desc).trim()
      : 'X';
    this.infoTamano = this.selectedTamano
      ? String(this.selectedTamano.tm_desc).trim()
      : 'X';
    this.infoGrosor = this.selectedGrosor
      ? String(this.selectedGrosor.gl_desc).trim()
      : '';
    this.infoClasificado = this.selectedClasificado
      ? String(this.selectedClasificado.value).trim()
      : '';
    this.infoAcabadoselect = this.selectedAcabado
      ? String(this.selectedAcabado.viewValue).trim()
      : '';
    this.infoAcabadofilter = this.selectedAcabadoName
      ? String(this.selectedAcabadoName).trim()
      : '';
    this.infoColor = this.selectedColorName
      ? String(this.selectedColorName).trim()
      : '';

    if (this.selectedAcabado.value == 'AC') {
      this.infoDesc =
        this.infoLinea +
        '  ' +
        this.infoTambor +
        '  ' +
        this.infoFormato +
        '  ' +
        this.infoTamano +
        '  ' +
        this.infoGrosor +
        '  ' +
        this.infoClasificado +
        ' ' +
        this.infoAcabadofilter +
        ' ' +
        this.infoColor;
    } else
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
        this.infoClasificado +
        ' ' +
        this.infoAcabadoselect +
        ' ' +
        this.infoColor;
  }

  mostrarCodigo() {
    this.infoLinea = this.selectedLinea
      ? String(this.selectedLinea.tp_desc).trim().substr(-20, 1)
      : '';
    this.infoTambor = this.selectedTambor
      ? String(this.selectedTambor.value).trim()
      : '';
    this.infoFormato = this.selectedFormato
      ? String(this.selectedFormato.ft_codi).trim()
      : 'X';
    this.infoTamano = this.selectedTamano
      ? String(this.selectedTamano.tm_codi).trim()
      : 'X';
    this.infoGrosor = this.selectedGrosor
      ? String(this.selectedGrosor.gl_codi).trim()
      : '';
    this.infoClasificado = this.selectedClasificado
      ? String(this.selectedClasificado.value).trim()
      : '';
    this.infoAcabadoselect = this.selectedAcabado
      ? String(this.selectedAcabado.value).trim()
      : '';
    this.infoAcabadofilter = this.selectedAcabadosCodi
      ? String(this.selectedAcabadosCodi).trim()
      : '';
    this.infoColor = this.selectedColores
      ? String(this.selectedColores).trim()
      : '';

    if (this.selectedAcabado.value == 'AC') {
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
        this.infoClasificado +
        ' ' +
        this.infoAcabadofilter +
        ' ' +
        this.infoColor;
    } else
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
        this.infoClasificado +
        ' ' +
        this.infoAcabadoselect +
        ' ' +
        this.infoColor;
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
    this.selectedColores = '';
    this.selectedAcabadosCodi = '';
    this.mostrarInfo();
    this.mostrarCodigo();

    this.isDisabledTamano = false;
  }
  selectTamanoChangue(values: Tambor) {
    /* this.selectedTamano.tm_codi = values; */

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
    this.selectedColores = '';
    this.selectedAcabadosCodi = '';
    this.isDisabledGrosor = false;

    this.mostrarInfo();
    this.mostrarCodigo();
  }

  selectGrosorChangue(values: any) {
    this.isDisabledClasificado = false;

    this.selectedClasificado = {
      value: '',
    };
    this.selectedAcabado = {
      value: '',
      viewValue: '',
    };
    this.selectedColores = '';
    this.selectedAcabadosCodi = '';
    this.isDisabledGrosor = false;
    this.mostrarInfo();
    this.mostrarCodigo();
  }

  selectClasificadoChangue(values: Clasificado) {
    this.isDisabledAcabado = false;

    this.selectedAcabado = {
      value: '',
      viewValue: '',
    };
    this.selectedColores = '';
    this.selectedAcabadosCodi = '';
    this.isDisabledGrosor = false;
    this.mostrarInfo();
    this.mostrarCodigo();
  }
  selectAcabadoChangue(values: any) {
    if (this.selectedAcabado.value === 'TE') {
      this.isDisabledAutoCompleteC = true;
      this.isDisabledAutoCompleteA = false;
    } else {
      if (this.selectedAcabado.value === 'AC') {
        this.isDisabledAutoCompleteC = true;
        this.isDisabledAutoCompleteA = true;
      } else {
        (this.isDisabledAutoCompleteA = false),
          (this.isDisabledAutoCompleteC = false);
      }
    }

    this.selectedColores = '';
    this.selectedAcabadosCodi = '';
    this.isDisabledGrosor = false;
    this.mostrarInfo();
    this.mostrarCodigo();
  }

  onChange() {}
  public useDefault = false;
  toggle(event: MatSlideToggleChange) {
    console.log('Toggle fired');
    this.useDefault = event.checked;
  }
  AddTarifa: any;
  submitArticulo() {
    if (this.AddTarifa == null) {
      Swal.fire({
        icon: 'warning',
        title: 'Añadir campos requeridos',
        showConfirmButton: false,
        timer: 1700,
      });
    } else
      Swal.fire({
        title: 'Confirmar registro del articulo',
        text: this.infoDesc,
        showDenyButton: true,
        icon: 'success',
        showCancelButton: false,
        confirmButtonText: `Confirmar`,
        denyButtonText: `No confirmar`,
      }).then((result) => {
        if (result.isConfirmed) {
          /*  const body = {
           ta_codi: 'C',
            ta_clta: '',
            ta_artic: '',
            ta_gruix:  '',
            ta_acaba: '',
            ta_color:  '',
            ta_clas:  '',
            ta_unifa:  '',
            ta_divis: '',
            ta_tarif_001: '',
            ta_tarif_002: 0,
            ta_tarif_003: 0,
            ta_tarif_004: 0,
            ta_listar: 'S'
          };
          this.articuloService.postArticulos(body).subscribe(
            (resp) => {
              this.datos_articulo = resp.data;
            },
            (error) => console.log(error)
          ); */
          //añadir codigo del postArticulo
          Swal.fire('Articulo registrado correctamente', '', 'success');
        } else if (result.isDenied) {
          Swal.fire('Operación interrumpida', '', 'info');
        }
      });
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
        Swal.fire('Registro de articulo cancelado', '', 'info');
        this.isHomeRoute();
      }
    });
  }

  isHomeRoute() {
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

  BottonAddEspecificacion() {}
}
