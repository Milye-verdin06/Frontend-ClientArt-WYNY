import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  ReqLineas,
  ReqFormatos,
  ReqTamanos,
  ReqGrosores,
  ReqColores,
  AcabadosRespons,
  ReqArticulos,
  ReqArticulosExistentes,
  ReqTambor,
  ReqColoresAC,
  ColorACRespons,
} from 'src/app/models/marroquineria/articulo';
import { ArticuloService } from 'src/app/services/Smarroquineria/articulo.service';
import { parametroMService } from 'src/app/services/Smarroquineria/parametroM.service';
import { ClienteService } from '../../services/cliente.service';
import { AprobationService } from 'src/app/services/Smarroquineria/aprobation.service';
import { Validacion_c_articService } from 'src/app/services/Smarroquineria/validacion_c_artic.service';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import {
  ColorRespons,
  ReqAcabados,
  ReqSeleccion,
} from '../../models/marroquineria/articulo';

import {
  MatAutocomplete,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
import Swal from 'sweetalert2';
import { EspecificacionService } from 'src/app/services/Smarroquineria/especificacion.service';

import { ReqcArtic } from 'src/app/models/cArtic';
import { ViewChild } from '@angular/core';
import { CorreoService } from '../../services/correo.service';
import { ReqCorreo } from 'src/app/models/Correo';
import { environment } from 'src/environments/environment';

interface Acabado {
  value: string;
  viewValue: string;
}

interface Tamano {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-agregar-articulos',
  templateUrl: './agregar-articulos marroquineria.component.html',
})
export class AgregarArticulosComponent implements OnInit {
  @ViewChild('addespecificacion') modalContent: any;

  datos_articulo: ReqArticulos[] = [];
  datos_articuloenTarifa: ReqArticulosExistentes[] = [];
  datos_artic: ReqcArtic[] = [];
  datos_especificacion: any;
  myControls: FormControl[] = [new FormControl('')];
  myControl2: FormControl[] = [new FormControl('')];
  myControl3: FormControl[] = [new FormControl('')];

  isDisabledTambor = true; //deshabilitar el select de tambor hasta que seleccionen la familia
  isDisabledFormato = true; //deshabilitar el select de formato hasta que seleccionen el tambor
  isDisabledTamano = true; //deshabilitar el select de tamano hasta que seleccionen el formato
  isDisabledGrosor = true; //deshabilitar el select de grosor hasta que seleccionen el tamano
  isDisabledClasificado = true; //deshabilitar el select de clasificado hasta que seleccionen el grosor
  isDisabledAcabado = true; //deshabilitar el select de acabado hasta que seleccionen el clasificado
  isDisabledAutoCompleteC = true; //no mostrar el auto-complete de Colores

  isDisabledAutoCompleteA = true; //no mostrar el auto-complete de Acabados

  isDisabledButtonEspe = false; //deshabilitar el botton de agregar especificaciones

  isDisabledseleAcabado = true; //no seleccionar ningun acabado en el mat-input de Acabados
  isDisabledseleColor = true; //no seleccionar ningun color en el mat-input de Colores
  isDisabledseleColorAC = true; //no seleccionar ningun color en el mat-input de Colores

  isDisabledcolores = true; //ocultar  la opcion de seleccionar color en tenido
  isDisabledcoloresAC = false; //ocultar la opcioin de seleccionar color en acabados
  public Articulos: any = [];
  public datos_linea: ReqLineas[] = [];
  public datos_formato: ReqFormatos[] = [];
  public datos_tamano: ReqTamanos[] = [];
  public datos_tambor: ReqTambor[] = [];
  public datos_seleccion: ReqSeleccion[] = [];
  public datos_grosor: ReqGrosores[] = [];
  public datos_color: ReqColores[] = [];
  public datos_acabados: ReqAcabados[] = [];
  public datos_correo: ReqCorreo[] = [];

  nomCliente: any;
  codCliente: any;
  unidadSelecc: any;

  divisaSelecc: any;
  nomDivisa: any;
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

  //tambor: Tambor[] = [
  //  { value: 'L', viewValue: 'LISO' },
  // { value: 'T', viewValue: 'TAMBOREADO' },
  //  { value: 'M', viewValue: 'MUY TAMBOREADO' },
  //];

  acabado: Acabado[] = [
    { value: 'NA', viewValue: 'NATURAL' },
    { value: 'TC', viewValue: 'TENIDO' },
    { value: 'UI', viewValue: 'ACABADO' },
  ];

  tambores: ReqTambor[] = [];
  formatos: ReqFormatos[] = [];
  aintarifa: number[] = [];
  ainfoDesc: string[] = [];
  ainfoCodigo: string[] = [];
  tamanos: ReqTamanos[] = [];
  codigos: ReqcArtic[] = [];

  clasificados: ReqSeleccion[] = [];
  grosores: ReqGrosores[] = [];

  public Acabados: AcabadosRespons[] = [];
  optionsAcabados: ReqAcabados[] = [];
  public filteredOptionsAcabados: Observable<ReqAcabados[]>[] = [];

  public Colores: ColorRespons[] = [];
  optionsColores: ReqColores[] = [];

  public ColoresAC: ColorACRespons[] = [];
  optionsColoresAC: ReqColoresAC[] = [];
  public filteredOptionsColores: Observable<ReqColores[]>[] = [];
  public filteredOptionsCOlores2: Observable<ReqColores> | undefined;

  public filteredOptionsColoresAC: Observable<ReqColoresAC[]>[] = [];
  public filteredOptionsCOloresAC2: Observable<ReqColoresAC> | undefined;

  public selectedAcabadosCodi: ReqAcabados;
  public selectedAcabadoName: string;

  public selectedColores: ReqColores;
  public selectedColorName: string;

  public selectedColoresAC: ReqColoresAC;
  public selectedColorNameAC: string;

  selectedLinea: ReqLineas;
  selectedTambor: ReqTambor;
  selectedFormato: ReqFormatos;
  selectedTamano: ReqTamanos;
  selectedGrosor: ReqGrosores;
  selectedClasificado: ReqSeleccion;

  selectedAcabado: Acabado;
  public nombreVendedor: string = '';

  constructor(
    private location: Location,
    private articuloService: ArticuloService,
    private parametroMService: parametroMService,
    private especificacionService: EspecificacionService,
    private Validacion_c_articService: Validacion_c_articService,
    private ClienteService: ClienteService,
    private aprobationService: AprobationService,
    private correoService: CorreoService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private aRouter: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private renderer: Renderer2
  ) {
    this.selectedLinea = this.datos_linea[1];
    this.selectedTambor = this.datos_tambor[1];
    this.selectedFormato = this.datos_formato[1];
    this.selectedTamano = this.datos_tamano[1];
    this.selectedClasificado = this.datos_seleccion[1];
    this.selectedGrosor = this.datos_grosor[1];
    this.selectedAcabado = this.acabado[1];

    this.selectedAcabadosCodi = {
      ac_codi: '',
      ac_desce: '',
    };
    this.selectedAcabadoName = '';
    this.Acabados = [];

    this.selectedColores = {
      cl_codi: '',
      cl_desc: '',
      cl_linea: '',
    };
    this.selectedColorName = '';
    this.Colores = [];

    this.selectedColoresAC = {
      co_codi: '',
      co_desce: '',
    };
    this.selectedColorNameAC = '';

    this.ColoresAC = [];

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
    this.MostrarColoresAC();
    this.nombreVendedor = environment.nom;

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

    this.aprobationService.getNombreDivisa().subscribe((d) => {
      this.nomDivisa = d;
    });

    this.aprobationService.getUnidadN().subscribe((d) => {
      this.unidadNSelecc = d;
    });

    this.ClienteService.getClientes;

    this.parametroMService.getlinea().subscribe(
      (resp) => {
        this.datos_linea = resp.data;
      },
      (error) => console.log(error)
    );

    this.parametroMService.gettambor().subscribe(
      (resp) => {
        this.datos_tambor = resp.data;
      },
      (error) => console.log(error)
    );

    this.parametroMService.getseleccion().subscribe(
      (resp) => {
        this.datos_seleccion = resp.data;
      },
      (error) => console.log(error)
    );

    this.parametroMService.getformato().subscribe(
      (resp) => {
        this.datos_formato = resp.data;
      },
      (error) => console.log(error)
    );

    this.parametroMService.gettamano().subscribe(
      (resp) => {
        this.datos_tamano = resp.data;
      },
      (error) => console.log(error)
    );

    this.parametroMService.getgrosor().subscribe(
      (resp) => {
        this.datos_grosor = resp.data;
      },
      (error) => console.log(error)
    );

    this.parametroMService.getAcabado().subscribe(
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
    //console.log(this.selectedAcabadosCodi.ac_codi);
  }
  public displayFnColores(color: ReqColores): string {
    return color && String(color.cl_desc).trim()
      ? String(color.cl_desc).trim()
      : '';
  }

  private _filterColores(cl_desc: string): ReqColores[] {
    const filterValueC = cl_desc.toLowerCase();

    return this.optionsColores.filter(
      (option) => option.cl_desc.toLowerCase().indexOf(filterValueC) === 0
    );
  }
  codSelectedColores(
    codigo: ReqColores,
    trigger: MatAutocompleteTrigger,
    auto: MatAutocomplete
  ) {
    this.selectedColores = {
      cl_codi: codigo.cl_codi,
      cl_desc: codigo.cl_desc,
      cl_linea: codigo.cl_linea,
    };

    this.selectedColorName = codigo.cl_desc;

    this.mostrarInfo();
    this.mostrarCodigo();
  }

  public displayFnColoresAC(color: ReqColoresAC): string {
    return color && String(color.co_desce).trim()
      ? String(color.co_desce).trim()
      : '';
  }

  private _filterColoresAC(co_desce: string): ReqColoresAC[] {
    const filterValueC = co_desce.toLowerCase();

    return this.optionsColoresAC.filter(
      (option) => option.co_desce.toLowerCase().indexOf(filterValueC) === 0
    );
  }
  codSelectedColoresAC(
    codigo: ReqColoresAC,
    trigger: MatAutocompleteTrigger,
    auto: MatAutocomplete
  ) {
    this.selectedColoresAC = {
      co_codi: codigo.co_codi,
      co_desce: codigo.co_desce,
    };

    this.selectedColorNameAC = codigo.co_desce;

    this.mostrarInfo();
    this.mostrarCodigo();
  }

  MostrarColores() {
    const body1 = {
      co_lin: this.selectedLinea.tp_codi,
    };
    this.parametroMService.getcolor(body1).subscribe(
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
  }

  MostrarColoresAC() {
    this.parametroMService.getColorAC().subscribe(
      (resp) => {
        this.optionsColoresAC = resp.data;
      },
      (error) => console.log(error)
    );
    this.filteredOptionsColoresAC.push(
      this.myControl3[0].valueChanges.pipe(
        startWith(''),
        map((value) => (typeof value === 'string' ? value : value.co_codi)),
        map((name) =>
          name ? this._filterColoresAC(name) : this.optionsColoresAC.slice()
        )
      )
    );
  }
  selectedLineaChange(values: ReqLineas) {
    this.MostrarColores();

    this.AddTarifa = '';
    if (this.selectedLinea.tp_codi === String('CS').trim()) {
      this.isDisabledTamano = false;
    } else this.isDisabledTamano = true;
    console.log(this.selectedLinea.tp_codi);

    this.tambores = this.datos_tambor.filter(
      (u) => u.tl_linea == String(values.tp_codi).trim()
    );
    this.formatos = this.datos_formato.filter(
      (u) => u.ft_tpiel == String(values.tp_codi).trim()
    );

    this.clasificados = this.datos_seleccion.filter(
      (u) => u.sl_linea == String(values.tp_codi).trim()
    );

    this.isDisabledTambor = false;
    this.isDisabledFormato = true;
    this.isDisabledTamano = true;
    this.isDisabledAcabado = true;
    this.isDisabledClasificado = true;
    this.isDisabledGrosor = true;

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
      tl_codi: '',
      tl_desc: '',
      tl_linea: '',
      tl_sts: '',
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
      sl_codi: '',
      sl_desc: '',
      sl_linea: '',
    };
    this.selectedAcabado = {
      value: '',
      viewValue: '',
    };
    this.selectedColores = {
      cl_codi: '',
      cl_desc: '',
      cl_linea: '',
    };
    this.selectedColoresAC = {
      co_codi: '',
      co_desce: '',
    };
    this.selectedAcabadosCodi = {
      ac_codi: '',
      ac_desce: '',
    };

    this.mostrarInfo();
    this.mostrarCodigo();
    this, this.myControl2[0].setValue(this.selectedColores);
    this, this.myControls[0].setValue(this.selectedAcabadosCodi);
    this, this.myControl3[0].setValue(this.selectedColoresAC);
    this.isDisabledseleColor = true; //inhabilita seleccionar color tenido
    this.isDisabledseleAcabado = true; //inhabilita seleccionar acabado
    this.isDisabledseleColorAC = true; //inhabilita seleccionar color acabado
  }

  tamborSeleccionado: any;
  selectTamborChangue(values: ReqTambor) {
    this.tamborSeleccionado = values.tl_codi;

    this.isDisabledFormato = false;
    this.isDisabledTamano = true;
    this.isDisabledAcabado = true;
    this.isDisabledClasificado = true;
    this.isDisabledGrosor = true;

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
      sl_codi: '',
      sl_desc: '',
      sl_linea: '',
    };
    this.selectedAcabado = {
      value: '',
      viewValue: '',
    };
    this.selectedColores = {
      cl_codi: '',
      cl_desc: '',
      cl_linea: '',
    };
    this.selectedColoresAC = {
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
    const bodyC = {
      codigoTarifa: this.infoCodi.substring(0, 4),
    };

    if ((this.formatos.length == 0, this.tamanos.length == 0)) {
      this.Validacion_c_articService.getArticulosC_artic(bodyC).subscribe(
        (resp) => {
          this.datos_artic = resp.data;
          if (
            (this.datos_artic.length == 1,
            this.selectedFormato.ft_codi == this.selectedFormato.ft_codi)
          ) {
            this.isDisabledGrosor = false;
            console.log('si existe el artículo en c_artic');
          } else {
            this.datos_artic.length == 0;
            Swal.fire({
              icon: 'warning',
              title: 'Código incorrecto',
              text: 'Verificar los datos, o ponerse en contacto con área de TI',

              // timer: 1500,
            });
            this.isDisabledGrosor = true;
          }
        },
        (error) => console.log(error)
      );
    } else {
      console.log('te faltan un carácter por seleccionar');
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
      sl_codi: '',
      sl_desc: '',
      sl_linea: '',
    };
    this.selectedAcabado = {
      value: '',
      viewValue: '',
    };
    this.selectedColores = {
      cl_codi: '',
      cl_desc: '',
      cl_linea: '',
    };
    this.selectedColoresAC = {
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

    this.isDisabledAcabado = true;
    this.isDisabledClasificado = true;

    const bodyC = {
      codigoTarifa: this.infoCodi.substring(0, 4),
    };

    if (this.tamanos.length == 0) {
      this.Validacion_c_articService.getArticulosC_artic(bodyC).subscribe(
        (resp) => {
          this.datos_artic = resp.data;
          if (this.datos_artic.length == 1) {
            this.isDisabledGrosor = false;
            console.log('si existe el artículo en c_artic');
          } else {
            Swal.fire({
              icon: 'warning',
              title: 'Código incorrecto',
              text: 'Verificar los datos, o ponerse en contacto con área de TI',

              //timer: 1500,
            });
            this.isDisabledGrosor = true;
          }
        },
        (error) => console.log(error)
      );
    } else {
      console.log('te falta un carácter por seleccionar');
    }

    //this.isDisabledGrosor = true;

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
      sl_codi: '',
      sl_desc: '',
      sl_linea: '',
    };
    this.selectedAcabado = {
      value: '',
      viewValue: '',
    };
    this.selectedColores = {
      cl_codi: '',
      cl_desc: '',
      cl_linea: '',
    };
    this.selectedColoresAC = {
      co_codi: '',
      co_desce: '',
    };
    this.selectedAcabadosCodi = {
      ac_codi: '',
      ac_desce: '',
    };
    this.isDisabledGrosor = false;

    this.isDisabledClasificado = true;

    this.mostrarInfo();
    this.mostrarCodigo();

    const bodyC = {
      codigoTarifa: this.infoCodi.substring(0, 4),
    };

    if (this.tamanos.length >= 1) {
      this.Validacion_c_articService.getArticulosC_artic(bodyC).subscribe(
        (resp) => {
          this.datos_artic = resp.data;
          if (this.datos_artic.length == 1) {
            this.isDisabledGrosor = false;
            console.log('si existe el artículo en c_artic');
          } else {
            Swal.fire({
              icon: 'warning',
              title: 'Código incorrecto',
              text: 'Verificar los datos, o ponerse en contacto con área de TI',

              // timer: 1500,
            });
            this.isDisabledGrosor = true;
          }
        },
        (error) => console.log(error)
      );
    } else {
      console.log('te falta un carácter por seleccionar');
    }
  }

  selectGrosorChangue(values: any) {
    console.log(this.optionsColoresAC);
    this.isDisabledAcabado = false;

    this.selectedClasificado = {
      sl_codi: '',
      sl_desc: '',
      sl_linea: '',
    };
    this.selectedAcabado = {
      value: '',
      viewValue: '',
    };
    this.selectedColores = {
      cl_codi: '',
      cl_desc: '',
      cl_linea: '',
    };
    this.selectedColoresAC = {
      co_codi: '',
      co_desce: '',
    };
    this.selectedAcabadosCodi = {
      ac_codi: '',
      ac_desce: '',
    };
    this.isDisabledClasificado = true;
    //this.isDisabledAutoCompleteA = false;
    //this.isDisabledAutoCompleteC = false;
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
      cl_codi: '',
      cl_desc: '',
      cl_linea: '',
    };
    this.selectedColoresAC = {
      co_codi: '',
      co_desce: '',
    };

    this, this.myControl2[0].setValue(this.selectedColores);
    this, this.myControl3[0].setValue(this.selectedColoresAC);
    this, this.myControls[0].setValue(this.selectedAcabadosCodi);

    if (this.selectedAcabado.value === 'TC') {
      this.isDisabledseleAcabado = true; //inhabilita seleccionar el acabado del cuadro
      this.isDisabledseleColor = false; //habilita seleccionar el color del tenido
      // this.isDisabledseleColorAC = true; //inhabilita seleccionar el colorAC
      this.isDisabledcoloresAC = false; //oculta el cuadro para buscar el colorAC
      this.isDisabledcolores = true; //muestra el cuadro para eleccionar el color del tenido

      this.selectedColores = {
        cl_codi: '',
        cl_desc: '',
        cl_linea: '',
      };
      this.selectedAcabadosCodi = {
        ac_codi: '',
        ac_desce: '',
      };
      this.selectedColoresAC = {
        co_codi: '',
        co_desce: '',
      };
    } else {
      if (this.selectedAcabado.value === 'UI') {
        this.isDisabledseleAcabado = false; //habilita seleccionar un acabado
        this.isDisabledseleColorAC = false; //habilita seleccionar un colorACABADO
        this.isDisabledcoloresAC = true; //muestra el cuadro para seleciconar el colorAC
        this.isDisabledcolores = false; //oculta el cuadro de seleccion de colores del tenido
        //this.isDisabledAutoCompleteC = true;
        //this.isDisabledAutoCompleteA = true;
      } else {
        this.selectedColores = {
          cl_codi: '',
          cl_desc: '',
          cl_linea: '',
        };
        this.selectedColoresAC = {
          co_codi: '',
          co_desce: '',
        };
        this.selectedAcabadosCodi = {
          ac_codi: '',
          ac_desce: '',
        };
        this.isDisabledseleAcabado = true; //inhabilita seleccionar acabado
        this.isDisabledseleColor = true; //inhabilita seleccionar color tenido
        // this.isDisabledseleColorAC = true; //inhabilita seleccionar colorAcabado
        this.isDisabledcolores = true; //muestra el recuadro de seleccionar color tenido, pero no permite seleccionar ninguno
        this.isDisabledcoloresAC = false; //oculta el cuadro de seleccionar colorAC
        //  (this.isDisabledAutoCompleteA = false),
        // (this.isDisabledAutoCompleteC = false);
      }
    }

    this.isDisabledGrosor = false;
    this.mostrarInfo();
    this.mostrarCodigo();
  }

  clasifSeleccionado: any;
  selectClasificadoChangue(values: ReqSeleccion) {
    this.clasifSeleccionado = values.sl_codi;
    this.mostrarInfo();
    this.mostrarCodigo();

    this.isDisabledButtonEspe = true;
  }
  infoCodi: string = '';
  infoDesc: string = '';
  infoEspeci: string = '';
  infoLinea: string = '';
  infoTambor: string = '';
  infoFormato: string = '';
  infoTamano: string = '';
  infoGrosor: string = '';
  infoClasificado: string = '';
  infoAcabadoselect: string = '';
  infoColor: string = '';
  infoColorAC: string = '';
  infoAcabadofilter: string = '';

  mostrarInfo() {
    this.infoLinea = this.selectedLinea
      ? String(this.selectedLinea.tp_desc)
          .trim()
          .substring(2, String(this.selectedLinea.tp_desc).trim().length)
      : '';
    this.infoTambor = this.selectedTambor
      ? String(this.selectedTambor.tl_desc).trim()
      : '';
    if (this.selectedLinea.tp_codi && this.selectedTambor.tl_codi) {
      this.infoFormato = this.selectedFormato.ft_desci
        ? String(this.selectedFormato.ft_desc).trim()
        : ' ';
    } else {
      this.infoFormato = '';
    }
    if (this.selectedLinea.tp_codi && this.selectedTambor.tl_codi) {
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
    this.infoColor = this.selectedColores.cl_codi
      ? String(this.selectedColorName).trim()
      : '';
    this.infoColorAC = this.selectedColoresAC.co_codi
      ? String(this.selectedColorNameAC).trim()
      : '';
    this.infoClasificado = this.selectedClasificado //mostrar el valor del mat-selected NATURAL 'NA' TENIDO 'TC'
      ? String(this.selectedClasificado.sl_codi).trim()
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
        this.infoColorAC +
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
      ? String(this.selectedTambor.tl_codi).trim()
      : '';
    if (this.selectedLinea.tp_codi && this.selectedTambor.tl_codi) {
      this.infoFormato = this.selectedFormato.ft_codi
        ? String(this.selectedFormato.ft_codi).trim()
        : 'X';
    } else {
      this.infoFormato = '';
    }
    if (this.selectedLinea.tp_codi && this.selectedTambor.tl_codi) {
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
    this.infoColor = this.selectedColores.cl_codi
      ? String(this.selectedColores.cl_codi).trim()
      : '';
    this.infoColorAC = this.selectedColoresAC.co_codi
      ? String(this.selectedColoresAC.co_codi).trim()
      : '';
    this.infoClasificado = this.selectedClasificado
      ? String(this.selectedClasificado.sl_codi).trim()
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
        this.infoColorAC +
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
    //console.log('Toggle fired');
    this.useDefault = event.checked;
  }
  AddTarifa: any;

  onResetForm() {
    //eliminar contenido del formulario
    this.articuloForm.reset();
  }

  submitArticulo() {
    const bodyC = {
      codigoTarifa: this.infoCodi.substring(0, 4),
    };

    this.Validacion_c_articService.getArticulosC_artic(bodyC).subscribe(
      (resp) => {
        this.datos_artic = resp.data;
      },
      (error) => console.log(error)
    );

    if (
      this.AddTarifa == null ||
      this.AddTarifa == '' ||
      this.selectedClasificado.sl_codi == ''
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Llenar campos requeridos',
        showConfirmButton: false,
        timer: 1900,
      });
    } else {
      if (
        this.selectedAcabado.value == 'TC' &&
        this.selectedColores.cl_codi == ''
      ) {
        Swal.fire({
          icon: 'question',
          title: 'Verificar',
          text: 'Seleccionar color',
          showConfirmButton: false,
          timer: 1900,
        });
      } else {
        if (
          this.selectedAcabado.value == 'UI' &&
          (this.selectedColoresAC.co_codi == '' ||
            this.selectedAcabadosCodi.ac_codi == '')
        ) {
          Swal.fire({
            icon: 'question',
            title: 'Verificar',
            text: 'Seleccionar color y acabado',
            showConfirmButton: false,
            timer: 1900,
          });
        } else {
          Swal.fire({
            title: 'Confirmar registro del articulo',
            text: this.infoDesc,
            showDenyButton: true,
            icon: 'success',
            showCancelButton: false,
            confirmButtonText: `Confirmar`,
            denyButtonText: `No confirmar`,
            confirmButtonColor: '#172b4d',
          }).then((result) => {
            if (result.isConfirmed) {
              const body = {
                ta_clta: this.codCliente,
                ta_artic: this.infoCodi.substring(0, 4),
                ta_gruix: this.selectedGrosor.gl_codi,
                ta_acaba: 'NA',
                ta_color: '9',
                ta_clas: this.selectedClasificado.sl_codi,
                ta_unifa: this.unidadSelecc,
                ta_divis: this.divisaSelecc,
                ta_tarif_001: this.AddTarifa,
                ta_tarif_002: '',
              };

              this.articuloService.getArticulosinTarifa(body).subscribe(
                (resp) => {
                  this.datos_articuloenTarifa = resp.data;
                  if (this.datos_articuloenTarifa.length >= 1) {
                    Swal.fire({
                      icon: 'warning',
                      title: 'El artículo ya existe',
                      text: 'Favor de verificar la información',
                      showConfirmButton: true,
                      confirmButtonColor: '#172b4d',
                      confirmButtonText: `Verificar`,
                    });
                  } else {
                    if (this.selectedAcabado.value == 'NA') {
                      this.ainfoDesc.push(this.infoDesc);
                      this.ainfoCodigo.push(this.infoCodi);
                      this.aintarifa.push(this.AddTarifa);
                      const bodyNAA = {
                        ta_codi: 'C',
                        ta_clta: this.codCliente,
                        ta_artic: this.infoCodi.substring(0, 4),
                        ta_gruix: this.selectedGrosor.gl_codi,
                        ta_acaba: 'NA',
                        ta_color: '9',
                        ta_clas: this.selectedClasificado.sl_codi,
                        ta_unifa: this.unidadSelecc,
                        ta_divis: this.divisaSelecc,
                        ta_tarif_001: this.AddTarifa,
                        ta_tarif_002: '',
                        ta_tarif_003: '',
                        ta_tarif_004: '',
                        ta_listar: 'S',
                      };
                      this.articuloService.postArticulos(bodyNAA).subscribe(
                        (resp) => {
                          this.datos_articulo = resp.data;

                          Swal.fire({
                            title: 'Articulo registrado correctamente',
                            text: 'Desea agregar especificaciones al artículo',
                            icon: 'success',

                            showConfirmButton: true,
                            showCancelButton: true,
                            confirmButtonColor: '#172b4d',
                            cancelButtonColor: '#BB3939',
                            cancelButtonText: 'No',
                            confirmButtonText: 'Si',
                          }).then((result) => {
                            if (result.isConfirmed) {
                              this.open(this.modalContent);
                            } else {
                              const bodyNAT = {
                                ef_clta: this.codCliente,
                                ef_artic: this.infoCodi.substring(0, 4),
                                ef_gruix: this.selectedGrosor.gl_codi,
                                ef_acaba: 'NA',
                                ef_color: '9',
                                ef_clas: this.selectedClasificado.sl_codi,
                                ef_unifa: this.unidadSelecc,
                                ef_divis: this.divisaSelecc,
                                ef_espe1: '',
                                ef_espe2: '',
                                ef_espe3: '',
                                ef_espe4: '',
                                ef_espe5: '',
                                ef_espe6: '',
                                ef_espe7: '',
                                ef_espe8: '',
                                ef_espe9: '',
                                ef_espe10: '',
                              };

                              this.especificacionService
                                .postEspecificacion(bodyNAT)
                                .subscribe(
                                  (resp) => {
                                    console.log(resp);
                                  },
                                  (error) => console.log(error)
                                );

                              this.selectedLinea = {
                                tp_codi: '',
                                tp_desc: '',
                              };
                              this.selectedTambor = {
                                tl_codi: '',
                                tl_desc: '',
                                tl_linea: '',
                                tl_sts: '',
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
                                sl_codi: '',
                                sl_desc: '',
                                sl_linea: '',
                              };
                              this.selectedAcabado = {
                                value: '',
                                viewValue: '',
                              };
                              this.selectedColores = {
                                cl_codi: '',
                                cl_desc: '',
                                cl_linea: '',
                              };
                              this.selectedColoresAC = {
                                co_codi: '',
                                co_desce: '',
                              };
                              this.selectedAcabadosCodi = {
                                ac_codi: '',
                                ac_desce: '',
                              };
                              this.AddTarifa = '';
                              this,
                                this.myControl2[0].setValue(
                                  this.selectedColores
                                );
                              this,
                                this.myControl3[0].setValue(
                                  this.selectedColoresAC
                                );
                              this,
                                this.myControls[0].setValue(
                                  this.selectedAcabadosCodi
                                );
                              this.infoCodi = '';
                              this.infoDesc = '';
                            }
                          });
                        },
                        (error) => console.log(error)
                      );
                    }
                  }
                },
                (error) => console.log(error)
              );

              const bodyTE = {
                ta_clta: this.codCliente,
                ta_artic: this.infoCodi.substring(0, 4),
                ta_gruix: this.selectedGrosor.gl_codi,
                ta_acaba: 'TC',
                ta_color: this.selectedColores.cl_codi,
                ta_clas: this.selectedClasificado.sl_codi,
                ta_unifa: this.unidadSelecc,
                ta_divis: this.divisaSelecc,
                ta_tarif_001: this.AddTarifa,
                ta_tarif_002: '',
              };

              this.articuloService.getArticulosinTarifa(bodyTE).subscribe(
                (resp) => {
                  this.datos_articuloenTarifa = resp.data;
                  if (this.datos_articuloenTarifa.length >= 1) {
                    Swal.fire({
                      icon: 'warning',
                      title: 'El artículo ya existe',
                      text: 'Favor de verificar la información',
                      showConfirmButton: true,
                      confirmButtonColor: '#172b4d',
                      confirmButtonText: `Verificar`,
                    });
                  } else {
                    if (this.selectedAcabado.value == 'TC') {
                      this.ainfoDesc.push(this.infoDesc);
                      this.ainfoCodigo.push(this.infoCodi);
                      this.aintarifa.push(this.AddTarifa);
                      const bodyTC = {
                        ta_codi: 'C',
                        ta_clta: this.codCliente,
                        ta_artic: this.infoCodi.substring(0, 4),
                        ta_gruix: this.selectedGrosor.gl_codi,
                        ta_acaba: 'TC',
                        ta_color: this.selectedColores.cl_codi,
                        ta_clas: this.selectedClasificado.sl_codi,
                        ta_unifa: this.unidadSelecc,
                        ta_divis: this.divisaSelecc,
                        ta_tarif_001: this.AddTarifa,
                        ta_tarif_002: '',
                        ta_tarif_003: '',
                        ta_tarif_004: '',
                        ta_listar: 'S',
                      };
                      this.articuloService.postArticulos(bodyTC).subscribe(
                        (resp) => {
                          this.datos_articulo = resp.data;
                          {
                            Swal.fire({
                              title: 'Articulo registrado correctamente',
                              text: 'Desea agregar especificaciones al artículo',
                              showConfirmButton: true,
                              icon: 'success',
                              showCancelButton: true,
                              confirmButtonColor: '#172b4d',
                              cancelButtonColor: '#BB3939',
                              cancelButtonText: 'No',
                              confirmButtonText: 'Si',
                            }).then((result) => {
                              if (result.isConfirmed) {
                                this.open(this.modalContent);
                              } else {
                                const bodyTEN = {
                                  ef_clta: this.codCliente,
                                  ef_artic: this.infoCodi.substring(0, 4),
                                  ef_gruix: this.selectedGrosor.gl_codi,
                                  ef_acaba: 'TC',
                                  ef_color: this.selectedColores.cl_codi,
                                  ef_clas: this.selectedClasificado.sl_codi,
                                  ef_unifa: this.unidadSelecc,
                                  ef_divis: this.divisaSelecc,
                                  ef_espe1: '',
                                  ef_espe2: '',
                                  ef_espe3: '',
                                  ef_espe4: '',
                                  ef_espe5: '',
                                  ef_espe6: '',
                                  ef_espe7: '',
                                  ef_espe8: '',
                                  ef_espe9: '',
                                  ef_espe10: '',
                                };

                                this.especificacionService
                                  .postEspecificacion(bodyTEN)
                                  .subscribe(
                                    (resp) => {
                                      console.log(resp);
                                    },
                                    (error) => console.log(error)
                                  );

                                this.selectedLinea = {
                                  tp_codi: '',
                                  tp_desc: '',
                                };
                                this.selectedTambor = {
                                  tl_codi: '',
                                  tl_desc: '',
                                  tl_linea: '',
                                  tl_sts: '',
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
                                  sl_codi: '',
                                  sl_desc: '',
                                  sl_linea: '',
                                };
                                this.selectedAcabado = {
                                  value: '',
                                  viewValue: '',
                                };
                                this.selectedColores = {
                                  cl_codi: '',
                                  cl_desc: '',
                                  cl_linea: '',
                                };
                                this.selectedColoresAC = {
                                  co_codi: '',
                                  co_desce: '',
                                };
                                this.selectedAcabadosCodi = {
                                  ac_codi: '',
                                  ac_desce: '',
                                };
                                this.AddTarifa = '';
                                this,
                                  this.myControl2[0].setValue(
                                    this.selectedColores
                                  );
                                this,
                                  this.myControl3[0].setValue(
                                    this.selectedColoresAC
                                  );
                                this,
                                  this.myControls[0].setValue(
                                    this.selectedAcabadosCodi
                                  );
                                this.infoCodi = '';
                                this.infoDesc = '';
                              }
                            });
                          }
                        },
                        (error) => console.log(error)
                      );
                    }
                  }
                },
                (error) => console.log(error)
              );

              const bodyACA = {
                ta_clta: this.codCliente,
                ta_artic: this.infoCodi.substring(0, 4),
                ta_gruix: this.selectedGrosor.gl_codi,
                ta_acaba: this.selectedAcabadosCodi.ac_codi,
                ta_color: this.selectedColores.cl_codi,
                ta_clas: this.selectedClasificado.sl_codi,
                ta_unifa: this.unidadSelecc,
                ta_divis: this.divisaSelecc,
                ta_tarif_001: this.AddTarifa,
                ta_tarif_002: '',
              };

              this.articuloService.getArticulosinTarifa(bodyACA).subscribe(
                (resp) => {
                  this.datos_articuloenTarifa = resp.data;
                  if (this.datos_articuloenTarifa.length >= 1) {
                    Swal.fire({
                      icon: 'warning',
                      title: 'El artículo ya existe',
                      text: 'Favor de verificar la información',
                      showConfirmButton: true,
                      confirmButtonColor: '#172b4d',
                      confirmButtonText: `Verificar`,
                    });
                  } else {
                    if (this.selectedAcabado.value == 'UI') {
                      this.ainfoDesc.push(this.infoDesc);
                      this.ainfoCodigo.push(this.infoCodi);
                      this.aintarifa.push(this.AddTarifa);
                      const bodyUI = {
                        ta_codi: 'C',
                        ta_clta: this.codCliente,
                        ta_artic: this.infoCodi.substring(0, 4),
                        ta_gruix: this.selectedGrosor.gl_codi,
                        ta_acaba: this.selectedAcabadosCodi.ac_codi,
                        ta_color: this.selectedColoresAC.co_codi,
                        ta_clas: this.selectedClasificado.sl_codi,
                        ta_unifa: this.unidadSelecc,
                        ta_divis: this.divisaSelecc,
                        ta_tarif_001: this.AddTarifa,
                        ta_tarif_002: '',
                        ta_tarif_003: '',
                        ta_tarif_004: '',
                        ta_listar: 'S',
                      };

                      this.articuloService.postArticulos(bodyUI).subscribe(
                        (resp) => {
                          this.datos_articulo = resp.data;
                          {
                            Swal.fire({
                              title: 'Articulo registrado correctamente',
                              text: 'Desea agregar especificaciones al artículo',
                              icon: 'success',
                              showConfirmButton: true,
                              showCancelButton: true,
                              confirmButtonColor: '#172b4d',
                              cancelButtonColor: '#BB3939',
                              cancelButtonText: 'No',
                              confirmButtonText: 'Si',
                            }).then((result) => {
                              if (result.isConfirmed) {
                                this.open(this.modalContent);
                              } else {
                                const bodyACC = {
                                  ef_clta: this.codCliente,
                                  ef_artic: this.infoCodi.substring(0, 4),
                                  ef_gruix: this.selectedGrosor.gl_codi,
                                  ef_acaba: this.selectedAcabadosCodi.ac_codi,
                                  ef_color: this.selectedColores.cl_codi,
                                  ef_clas: this.selectedClasificado.sl_codi,
                                  ef_unifa: this.unidadSelecc,
                                  ef_divis: this.divisaSelecc,
                                  ef_espe1: '',
                                  ef_espe2: '',
                                  ef_espe3: '',
                                  ef_espe4: '',
                                  ef_espe5: '',
                                  ef_espe6: '',
                                  ef_espe7: '',
                                  ef_espe8: '',
                                  ef_espe9: '',
                                  ef_espe10: '',
                                };

                                this.especificacionService
                                  .postEspecificacion(bodyACC)
                                  .subscribe(
                                    (resp) => {
                                      console.log(resp);
                                    },
                                    (error) => console.log(error)
                                  );

                                this.selectedLinea = {
                                  tp_codi: '',
                                  tp_desc: '',
                                };
                                this.selectedTambor = {
                                  tl_codi: '',
                                  tl_desc: '',
                                  tl_linea: '',
                                  tl_sts: '',
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
                                  sl_codi: '',
                                  sl_desc: '',
                                  sl_linea: '',
                                };
                                this.selectedAcabado = {
                                  value: '',
                                  viewValue: '',
                                };
                                this.selectedColores = {
                                  cl_codi: '',
                                  cl_desc: '',
                                  cl_linea: '',
                                };
                                this.selectedColoresAC = {
                                  co_codi: '',
                                  co_desce: '',
                                };
                                this.selectedAcabadosCodi = {
                                  ac_codi: '',
                                  ac_desce: '',
                                };
                                this.AddTarifa = '';
                                this,
                                  this.myControl2[0].setValue(
                                    this.selectedColores
                                  );
                                this,
                                  this.myControl3[0].setValue(
                                    this.selectedColoresAC
                                  );
                                this,
                                  this.myControls[0].setValue(
                                    this.selectedAcabadosCodi
                                  );
                                this.infoCodi = '';
                                this.infoDesc = '';
                              }
                            });
                          }
                        },
                        (error) => console.log(error)
                      );
                    }
                  }
                },
                (error) => console.log(error)
              );
            } else if (result.isDenied) {
              Swal.fire({
                icon: 'warning',
                title: 'Registro cancelado',
                showConfirmButton: true,
                confirmButtonColor: '#172b4d',
                confirmButtonText: `Continuar`,
              });
            }
          });
        }
      }
    }
  }

  opensweetalertCancelaRegistroArticulo(selectedItem?: any) {
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
          if (this.ainfoDesc.length == 0 && this.ainfoCodigo.length == 0) {
          } else {
            this.sendEmail();
          }
        }

        this.isHomeRoute();
      }
    });
  }
  cerrarAddEspeci() {
    {
      Swal.fire({
        width: 340,
        icon: 'warning',

        title: 'Incluir  especificaciones',
        text: 'Favor de guardar el registro',
        showConfirmButton: false,
        timer: 1900,
      });
    }
    // this.modalService.dismissAll();
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
    if (this.selectedAcabado.value == 'NA') {
      const body = {
        ef_clta: this.codCliente,
        ef_artic: this.infoCodi.substring(0, 4),
        ef_gruix: this.selectedGrosor.gl_codi,
        ef_acaba: 'NA',
        ef_color: '9',
        ef_clas: this.selectedClasificado.sl_codi,
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
            title: 'Registro exitoso',
            text: 'Especificaciones agregadas',
            icon: 'success',
            confirmButtonColor: '#172b4d',
            confirmButtonText: 'Confirmar',
          }).then((result) => {
            if (result.isConfirmed) {
              this.Addespeci1 = '';
              this.Addespeci2 = '';
              this.Addespeci3 = '';
              this.Addespeci4 = '';
              this.Addespeci5 = '';
              this.Addespeci6 = '';
              this.Addespeci7 = '';
              this.Addespeci8 = '';
              this.Addespeci9 = '';
              this.Addespeci10 = '';
              this.selectedLinea = {
                tp_codi: '',
                tp_desc: '',
              };
              this.selectedTambor = {
                tl_codi: '',
                tl_desc: '',
                tl_linea: '',
                tl_sts: '',
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
                sl_codi: '',
                sl_desc: '',
                sl_linea: '',
              };
              this.selectedAcabado = {
                value: '',
                viewValue: '',
              };
              this.selectedColores = {
                cl_codi: '',
                cl_desc: '',
                cl_linea: '',
              };
              this.selectedColoresAC = {
                co_codi: '',
                co_desce: '',
              };
              this.selectedAcabadosCodi = {
                ac_codi: '',
                ac_desce: '',
              };
              this.AddTarifa = '';
              this, this.myControl2[0].setValue(this.selectedColores);
              this, this.myControl3[0].setValue(this.selectedColoresAC);
              this, this.myControls[0].setValue(this.selectedAcabadosCodi);
              this.infoCodi = '';
              this.infoDesc = '';
              this.modalService.dismissAll();
            }
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
          ef_color: this.selectedColores.cl_codi,
          ef_clas: this.selectedClasificado.sl_codi,
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
              title: 'Registro exitoso',
              text: 'Especificaciones agregadas',
              icon: 'success',
              confirmButtonColor: '#172b4d',
              confirmButtonText: 'Confirmar',
            }).then((result) => {
              if (result.isConfirmed) {
                this.Addespeci1 = '';
                this.Addespeci2 = '';
                this.Addespeci3 = '';
                this.Addespeci4 = '';
                this.Addespeci5 = '';
                this.Addespeci6 = '';
                this.Addespeci7 = '';
                this.Addespeci8 = '';
                this.Addespeci9 = '';
                this.Addespeci10 = '';
                this.selectedLinea = {
                  tp_codi: '',
                  tp_desc: '',
                };
                this.selectedTambor = {
                  tl_codi: '',
                  tl_desc: '',
                  tl_linea: '',
                  tl_sts: '',
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
                  sl_codi: '',
                  sl_desc: '',
                  sl_linea: '',
                };
                this.selectedAcabado = {
                  value: '',
                  viewValue: '',
                };
                this.selectedColores = {
                  cl_codi: '',
                  cl_desc: '',
                  cl_linea: '',
                };
                this.selectedColoresAC = {
                  co_codi: '',
                  co_desce: '',
                };
                this.selectedAcabadosCodi = {
                  ac_codi: '',
                  ac_desce: '',
                };
                this.AddTarifa = '';
                this, this.myControl2[0].setValue(this.selectedColores);
                this, this.myControl3[0].setValue(this.selectedColoresAC);
                this, this.myControls[0].setValue(this.selectedAcabadosCodi);
                this.infoCodi = '';
                this.infoDesc = '';
                this.modalService.dismissAll();
              }
            });
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
            ef_color: this.selectedColoresAC.co_codi,
            ef_clas: this.selectedClasificado.sl_codi,
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
                title: 'Registro exitoso',
                text: 'Especificaciones agregadas',
                icon: 'success',
                confirmButtonColor: '#172b4d',
                confirmButtonText: 'Confirmar',
              }).then((result) => {
                if (result.isConfirmed) {
                  this.Addespeci1 = '';
                  this.Addespeci2 = '';
                  this.Addespeci3 = '';
                  this.Addespeci4 = '';
                  this.Addespeci5 = '';
                  this.Addespeci6 = '';
                  this.Addespeci7 = '';
                  this.Addespeci8 = '';
                  this.Addespeci9 = '';
                  this.Addespeci10 = '';

                  this.selectedLinea = {
                    tp_codi: '',
                    tp_desc: '',
                  };
                  this.selectedTambor = {
                    tl_codi: '',
                    tl_desc: '',
                    tl_linea: '',
                    tl_sts: '',
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
                    sl_codi: '',
                    sl_desc: '',
                    sl_linea: '',
                  };
                  this.selectedAcabado = {
                    value: '',
                    viewValue: '',
                  };
                  this.selectedColores = {
                    cl_codi: '',
                    cl_desc: '',
                    cl_linea: '',
                  };
                  this.selectedColoresAC = {
                    co_codi: '',
                    co_desce: '',
                  };
                  this.selectedAcabadosCodi = {
                    ac_codi: '',
                    ac_desce: '',
                  };
                  this.AddTarifa = '';
                  this, this.myControl2[0].setValue(this.selectedColores);
                  this, this.myControl3[0].setValue(this.selectedColoresAC);
                  this, this.myControls[0].setValue(this.selectedAcabadosCodi);
                  this.infoCodi = '';
                  this.infoDesc = '';
                  this.modalService.dismissAll();
                }
              });
            },
            (error) => console.log(error)
          );
        }
      }
    }
  }

  messageTable: string = '';
  sendEmail() {
    console.log('send email');

    for (let i = 0; i < this.ainfoDesc.length; i++) {
      this.messageTable =
        this.messageTable +
        `<tr><td>${this.ainfoDesc[i]}</td> <td>${this.ainfoCodigo[i]}</td> <td>${this.aintarifa[i]}</td></tr>`;
    }
    const body = {
      to: 'mili_verdin@wyny.com.mx',

      subject: `Alta artículo - ${this.nomCliente}`,

      message: `<div>
      <h1 style="font-family: Arial">&nbsp;&nbsp;Registro de nuevo articulo </h1>
                    <a>
                    <img src="https://i.mkt.lu/dl/thumb/7444781040/7188581810.jpg" width="150" height="150" border="0" alt="" style="float:left">
                    </a>


              <h5 style="font-family: Arial"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Vendedor: ${this.nombreVendedor}</h5>
              <h5 style="font-family: Arial"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Cliente: ${this.nomCliente}</h5>
              <h5 style="font-family: Arial"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Código cliente: ${this.codCliente}</h5>
              <h5 style="font-family: Arial"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Unidad de negocio: Marroquineria </h5>
              <h5 style="font-family: Arial"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Unidad de medida: ${this.unidadSelecc} </h5>
              <h5 style="font-family: Arial"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Divisa: ${this.divisaSelecc} </h5>
              </div>
              <br>
              <br>
              <br>
            <table class="table table-striped" align="center" border="1" cellpadding="0" cellspacing="0" width="950">
              <thead bgcolor="#3b5e9b">
                  <tr>

                    <th scope="col" width="550" style="font-family: Arial">Artículo</th>
                    <th scope="col" style="font-family: Arial">Código</th>
                    <th scope="col" style="font-family: Arial">Precio de venta</th>

                  </tr>
              </thead>
                <tbody>
                  ${this.messageTable}

                </tbody>
          </table>
           <h6 style="font-family: Arial" align="center"> Este mensaje se envió de manera automática, favor de NO responder,
           en caso de alguna aclaración favor de contactar con su ejecutivo de cuenta.
           </h6> `,

      cc: 'mili_verdin@wyny.com.mx',
    };

    this.correoService.postCorreos(body).subscribe(
      (resp) => {
        this.datos_correo = resp.data;
      },
      (error) => console.log(error)
    );
  }
}
