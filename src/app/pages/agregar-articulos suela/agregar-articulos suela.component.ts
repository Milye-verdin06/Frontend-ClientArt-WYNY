import { AprobationService } from 'src/app/services/Smarroquineria/aprobation.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { CombinacionRespons, ReqLineas } from 'src/app/models/suela/articuloS';
import { parametroSService } from 'src/app/services/Ssuela/parametroS.service';
import { Validacion_c_articService } from 'src/app/services/Smarroquineria/validacion_c_artic.service';
import { ReqPlanchado, ReqCombinacion } from '../../models/suela/articuloS';
import { map, startWith } from 'rxjs/operators';
import {
  MatAutocomplete,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
import { ReqcArtic } from 'src/app/models/cArtic';
import { ArticuloService } from 'src/app/services/Smarroquineria/articulo.service';
import {
  ReqArticulos,
  ReqArticulosExistentes,
} from 'src/app/models/marroquineria/articulo';
import { EspecificacionService } from 'src/app/services/Smarroquineria/especificacion.service';

interface Acabado {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-agregar-articulosSuela',
  templateUrl: './agregar-articulos suela.component.html',
})
export class AgregarArticulosSuelaComponent implements OnInit {
  @ViewChild('addespecificacion') modalContent: any;
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
  public datos_combinacionSEL: ReqCombinacion[] = [];
  public datos_cArtic: ReqcArtic[] = [];

  selectedLinea: ReqLineas;
  selectedPlanchado: ReqPlanchado;
  selectedCombinacionGR: ReqCombinacion;
  selectedCombinacionCL: ReqCombinacion;
  selectedCombinacionSEL: ReqCombinacion;
  selectedCombinacionACC: ReqCombinacion;
  selectedAcabado: Acabado;
  optionsColoresAC: ReqCombinacion[] = [];
  optionsAcabados: ReqCombinacion[] = [];
  datos_articuloenTarifa: ReqArticulosExistentes[] = [];
  datos_articulo: ReqArticulos[] = [];
  aintarifa: number[] = [];
  ainfoDesc: string[] = [];
  ainfoCodigo: string[] = [];
  datos_especificacion: any;

  public Colores: CombinacionRespons[] = [];
  public selectedColorNameAC: string;
  public selectedAcabadoName: string;

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
    private Validacion_c_articService: Validacion_c_articService,
    private router: Router,
    private parametroSService: parametroSService,
    private articuloService: ArticuloService,
    private modalService: NgbModal,
    private especificacionService: EspecificacionService
  ) {
    this.selectedAcabado = this.acabado[1];
    this.selectedLinea = this.datos_linea[1];
    this.selectedPlanchado = this.datos_planchado[1];
    this.selectedCombinacionGR = this.datos_combinacionGR[1];
    this.selectedCombinacionCL = this.datos_combinacionCL[1];
    this.selectedCombinacionACC = this.datos_combinacionAC[1];
    this.selectedCombinacionSEL = this.datos_combinacionSEL[1];

    this.Colores = [];
    this.selectedColorNameAC = '';
    this.selectedAcabadoName = '';
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
    this.mostrarInfo();
    this.mostrarCodigo();
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

    this.selectedAcabadoName = codigo.descripcion;
    this, this.myControls[0].setValue(this.selectedCombinacionACC);
    console.log(this.selectedCombinacionACC.codigo);
    this.mostrarInfo();
    this.mostrarCodigo();
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
        this.datos_combinacionSEL = resp.data;
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
    console.log('tamanaño de los planchados', this.datos_planchado.length);
    this.mostrarcolor();
    this.mostrarAcabado();

    this.mostrarPlanchado();
    this.isDisabledselePlanchado = false;
    this.mostrarGrosor();

    this.mostrarClasificacion();

    this.selectedPlanchado = {
      linea: '',
      descripcionLinea: '',
      codigo: '',
      descripcion: '',
    };
    this.selectedCombinacionGR = {
      linea: '',
      descripcionLinea: '',
      codigo: '',
      descripcion: '',
    };
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
    this.selectedCombinacionSEL = {
      linea: '',
      descripcionLinea: '',
      codigo: '',
      descripcion: '',
    };
    this.AddTarifa = '';

    this.mostrarInfo();
    this.mostrarCodigo();
    this, this.myControl2[0].setValue(this.selectedCombinacionCL);
    this, this.myControls[0].setValue(this.selectedCombinacionACC);
    this.isDisabledseleGrosor = true;
    this.isDisabledAcabado = true;
    this.isDisabledseleSeleccion = true; //deshabilitar la seleccion hasta que indicas si es tenido, acabado o natural
  }

  selectedPlanchadoChange(values: ReqPlanchado) {
    this.isDisabledseleGrosor = false;

    this.selectedCombinacionGR = {
      linea: '',
      descripcionLinea: '',
      codigo: '',
      descripcion: '',
    };
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
    this.selectedCombinacionSEL = {
      linea: '',
      descripcionLinea: '',
      codigo: '',
      descripcion: '',
    };
    this.mostrarInfo();
    this.mostrarCodigo();
  }
  selectedGrosorChange(values: ReqCombinacion) {
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
    this.selectedCombinacionSEL = {
      linea: '',
      descripcionLinea: '',
      codigo: '',
      descripcion: '',
    };
    this.mostrarInfo();
    this.mostrarCodigo();
    const bodyC = {
      codigoTarifa: this.infoCodi.substring(0, 4),
    };

    this.Validacion_c_articService.getArticulosC_artic(bodyC).subscribe(
      (resp) => {
        this.datos_cArtic = resp.data;
        if (this.datos_cArtic.length == 1) {
          console.log('si existe el articulo en cArtic');
          this.isDisabledAcabado = false;
        } else {
          this.datos_cArtic.length == 0;
          Swal.fire({
            icon: 'warning',
            title: 'Código incorrecto',
            text: 'Verificar los datos, o ponerse en contacto con área de TI',

            // timer: 1500,
          });
          this.isDisabledAcabado = true;
        }
      },
      (error) => console.log(error)
    );
  }
  selectAcabadoChangue(values: any) {
    this.isDisabledseleSeleccion = false;
    console.log(this.selectedAcabado.value);
    if (this.selectedAcabado.value == 'TC') {
      this.isDisabledseleColorAC = false; //no seleccionar ningun color en el mat-input de Colores
      this.isDisabledseleAcabado = true;
    } else if (this.selectedAcabado.value == 'U1') {
      this.isDisabledseleColorAC = false;
      this.isDisabledseleAcabado = false;

      //no seleccionar ningun color en el mat-input de Colores
    } else {
      this.isDisabledseleColorAC = true;
      this.isDisabledseleAcabado = true;
    }

    if (
      this.selectedAcabado.value == 'U1' &&
      this.optionsAcabados.length == 0
    ) {
      this.isDisabledseleColorAC = true;
      this.isDisabledseleAcabado = true;
      this.isDisabledseleSeleccion = true;
      Swal.fire({
        icon: 'warning',
        title: 'No hay acabados para la linea',
        text: 'seleccionar otra opción',
        showConfirmButton: false,
        timer: 2100,
      });
      this.selectedAcabado = {
        value: '',
        viewValue: '',
      };
    }
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
    this.selectedCombinacionSEL = {
      linea: '',
      descripcionLinea: '',
      codigo: '',
      descripcion: '',
    };
    this, this.myControl2[0].setValue(this.selectedCombinacionCL);
    this, this.myControls[0].setValue(this.selectedCombinacionACC);
    //console.log(this.optionsColoresAC);
    //console.log(this.optionsAcabados);
    this.mostrarInfo();
    this.mostrarCodigo();
  }
  selectedClasificacionChange(values: ReqCombinacion) {
    this.mostrarInfo();
    this.mostrarCodigo();
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
  }

  infoCodi: string = '';
  infoDesc: string = '';
  infoEspeci: string = '';
  infoLinea: string = '';
  infoplanchado: string = '';
  infoGrosor: string = '';
  infoSeleccion: string = '';
  infoAcabadoselect: string = '';
  infoColor: string = '';
  infoAcabadofilter: string = '';
  infoequis: string = 'X';

  mostrarInfo() {
    this.infoLinea = this.selectedLinea
      ? String(this.selectedLinea.tp_desc)
          .trim()
          .substring(3, String(this.selectedLinea.tp_desc).trim().length)
      : '';
    this.infoplanchado = this.selectedPlanchado
      ? String(this.selectedPlanchado.descripcion).trim()
      : '';

    this.infoGrosor = this.selectedCombinacionGR
      ? String(this.selectedCombinacionGR.descripcion).trim()
      : ' ';
    this.infoAcabadofilter = this.selectedCombinacionACC.descripcion
      ? String(this.selectedAcabadoName).trim()
      : '';
    this.infoAcabadoselect = this.selectedAcabado.viewValue
      ? String(this.selectedAcabado.viewValue).trim()
      : '';
    this.infoColor = this.selectedCombinacionCL.descripcion
      ? String(this.selectedColorNameAC).trim()
      : '';

    this.infoSeleccion = this.selectedCombinacionSEL.descripcion //mostrar el valor del mat-selected NATURAL 'NA' TENIDO 'TC'
      ? String(this.selectedCombinacionSEL.descripcion).trim()
      : ' ';

    if (this.selectedAcabado.value === 'U1') {
      this.infoDesc =
        this.infoLinea +
        ' ' +
        this.infoplanchado +
        ' ' +
        this.infoGrosor +
        ' ' +
        this.infoAcabadofilter +
        ' ' +
        this.infoColor +
        ' ' +
        this.infoSeleccion;
    } else {
      this.infoDesc =
        this.infoLinea +
        ' ' +
        this.infoplanchado +
        ' ' +
        this.infoGrosor +
        ' ' +
        this.infoAcabadoselect +
        ' ' +
        this.infoColor +
        ' ' +
        this.infoSeleccion;
    }
  }

  mostrarCodigo() {
    this.infoLinea = this.selectedLinea
      ? String(this.selectedLinea.tp_desc).trim().substr(-22, 2)
      : '';
    this.infoplanchado = this.selectedPlanchado
      ? String(this.selectedPlanchado.codigo).trim()
      : '';

    this.infoGrosor = this.selectedCombinacionGR
      ? String(this.selectedCombinacionGR.codigo).trim()
      : '';

    this.infoAcabadoselect = this.selectedAcabado
      ? String(this.selectedAcabado.value).trim()
      : '';
    this.infoAcabadofilter = this.selectedCombinacionACC.codigo
      ? String(this.selectedCombinacionACC.codigo).trim()
      : '';
    this.infoColor = this.selectedCombinacionCL.codigo
      ? String(this.selectedCombinacionCL.codigo).trim()
      : '';
    this.infoSeleccion = this.selectedCombinacionSEL
      ? String(this.selectedCombinacionSEL.codigo).trim()
      : '';

    if (this.selectedAcabado.value === 'U1') {
      this.infoCodi =
        this.infoLinea +
        '' +
        this.infoplanchado +
        '' +
        this.infoequis +
        ' ' +
        this.infoGrosor +
        ' ' +
        this.infoAcabadofilter +
        ' ' +
        this.infoColor +
        ' ' +
        this.infoSeleccion;
    } else {
      this.infoCodi =
        this.infoLinea +
        '' +
        this.infoplanchado +
        '' +
        this.infoequis +
        ' ' +
        this.infoGrosor +
        ' ' +
        this.infoAcabadoselect +
        ' ' +
        this.infoColor +
        ' ' +
        this.infoSeleccion;
    }
  }
  AddTarifa: any;
  submitArticulo() {
    if (
      this.AddTarifa == null ||
      this.AddTarifa == '' ||
      this.selectedCombinacionSEL.codigo == ''
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Llenar campos requeridos',
        showConfirmButton: false,
        timer: 1900,
      });
    } else {
      console.log(this.AddTarifa);
      console.log(this.selectedCombinacionSEL.codigo);

      if (
        this.selectedAcabado.value == 'TC' &&
        this.selectedCombinacionCL.codigo == ''
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
          this.selectedAcabado.value == 'U1' &&
          (this.selectedCombinacionCL.codigo == '' ||
            this.selectedCombinacionACC.codigo == '')
        ) {
          Swal.fire({
            icon: 'question',
            title: 'Verificar',
            text: 'Seleccionar color y acabado',
            showConfirmButton: false,
            timer: 1900,
          });
        } else {
          console.log('CONFIRMAR EL REGISTRO');
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
                ta_gruix: this.selectedCombinacionGR.codigo,
                ta_acaba: 'NA',
                ta_color: '9',
                ta_clas: this.selectedCombinacionSEL.codigo,
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
                        ta_gruix: this.selectedCombinacionGR.codigo,
                        ta_acaba: 'NA',
                        ta_color: '9',
                        ta_clas: this.selectedCombinacionSEL.codigo,
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
                                ef_gruix: this.selectedCombinacionGR.codigo,
                                ef_acaba: 'NA',
                                ef_color: '9',
                                ef_clas: this.selectedCombinacionSEL.codigo,
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

                              this.selectedPlanchado = {
                                linea: '',
                                descripcionLinea: '',
                                codigo: '',
                                descripcion: '',
                              };
                              this.selectedCombinacionGR = {
                                linea: '',
                                descripcionLinea: '',
                                codigo: '',
                                descripcion: '',
                              };
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
                              this.selectedCombinacionSEL = {
                                linea: '',
                                descripcionLinea: '',
                                codigo: '',
                                descripcion: '',
                              };
                              this.AddTarifa = '';
                              this,
                                this.myControl2[0].setValue(
                                  this.selectedCombinacionCL
                                );
                              this,
                                this.myControls[0].setValue(
                                  this.selectedCombinacionACC
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
              //siguiente valores de tenido
              const bodyTE = {
                ta_clta: this.codCliente,
                ta_artic: this.infoCodi.substring(0, 4),
                ta_gruix: this.selectedCombinacionGR.codigo,
                ta_acaba: 'TC',
                ta_color: this.selectedCombinacionCL.codigo,
                ta_clas: this.selectedCombinacionSEL.codigo,
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
                        ta_gruix: this.selectedCombinacionGR.codigo,
                        ta_acaba: 'TC',
                        ta_color: this.selectedCombinacionCL.codigo,
                        ta_clas: this.selectedCombinacionSEL.codigo,
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
                                  ef_gruix: this.selectedCombinacionGR.codigo,
                                  ef_acaba: 'TC',
                                  ef_color: this.selectedCombinacionCL.codigo,
                                  ef_clas: this.selectedCombinacionSEL.codigo,
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

                                this.selectedPlanchado = {
                                  linea: '',
                                  descripcionLinea: '',
                                  codigo: '',
                                  descripcion: '',
                                };
                                this.selectedCombinacionGR = {
                                  linea: '',
                                  descripcionLinea: '',
                                  codigo: '',
                                  descripcion: '',
                                };
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
                                this.selectedCombinacionSEL = {
                                  linea: '',
                                  descripcionLinea: '',
                                  codigo: '',
                                  descripcion: '',
                                };
                                this.AddTarifa = '';
                                this,
                                  this.myControl2[0].setValue(
                                    this.selectedCombinacionCL
                                  );
                                this,
                                  this.myControls[0].setValue(
                                    this.selectedCombinacionACC
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
              //incluir parametros de acabado
              const bodyACA = {
                ta_clta: this.codCliente,
                ta_artic: this.infoCodi.substring(0, 4),
                ta_gruix: this.selectedCombinacionGR.codigo,
                ta_acaba: this.selectedCombinacionACC.codigo,
                ta_color: this.selectedCombinacionCL.codigo,
                ta_clas: this.selectedCombinacionSEL.codigo,
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
                    if (this.selectedAcabado.value == 'U1') {
                      this.ainfoDesc.push(this.infoDesc);
                      this.ainfoCodigo.push(this.infoCodi);
                      this.aintarifa.push(this.AddTarifa);
                      const bodyUI = {
                        ta_codi: 'C',
                        ta_clta: this.codCliente,
                        ta_artic: this.infoCodi.substring(0, 4),
                        ta_gruix: this.selectedCombinacionGR.codigo,
                        ta_acaba: this.selectedCombinacionACC.codigo,
                        ta_color: this.selectedCombinacionCL.codigo,
                        ta_clas: this.selectedCombinacionSEL.codigo,
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
                                  ef_gruix: this.selectedCombinacionGR.codigo,
                                  ef_acaba: this.selectedCombinacionACC.codigo,
                                  ef_color: this.selectedCombinacionCL.codigo,
                                  ef_clas: this.selectedCombinacionSEL.codigo,
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

                                this.selectedPlanchado = {
                                  linea: '',
                                  descripcionLinea: '',
                                  codigo: '',
                                  descripcion: '',
                                };
                                this.selectedCombinacionGR = {
                                  linea: '',
                                  descripcionLinea: '',
                                  codigo: '',
                                  descripcion: '',
                                };
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
                                this.selectedCombinacionSEL = {
                                  linea: '',
                                  descripcionLinea: '',
                                  codigo: '',
                                  descripcion: '',
                                };
                                this.AddTarifa = '';
                                this,
                                  this.myControl2[0].setValue(
                                    this.selectedCombinacionCL
                                  );
                                this,
                                  this.myControls[0].setValue(
                                    this.selectedCombinacionACC
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
        ef_gruix: this.selectedCombinacionGR.codigo,
        ef_acaba: 'NA',
        ef_color: '9',
        ef_clas: this.selectedCombinacionSEL.codigo,
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

              this.selectedPlanchado = {
                linea: '',
                descripcionLinea: '',
                codigo: '',
                descripcion: '',
              };
              this.selectedCombinacionGR = {
                linea: '',
                descripcionLinea: '',
                codigo: '',
                descripcion: '',
              };
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
              this.selectedCombinacionSEL = {
                linea: '',
                descripcionLinea: '',
                codigo: '',
                descripcion: '',
              };
              this.AddTarifa = '';
              this, this.myControl2[0].setValue(this.selectedCombinacionCL);
              this, this.myControls[0].setValue(this.selectedCombinacionACC);
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
          ef_gruix: this.selectedCombinacionGR.codigo,
          ef_acaba: 'TC',
          ef_color: this.selectedCombinacionCL.codigo,
          ef_clas: this.selectedCombinacionSEL.codigo,
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

                this.selectedPlanchado = {
                  linea: '',
                  descripcionLinea: '',
                  codigo: '',
                  descripcion: '',
                };
                this.selectedCombinacionGR = {
                  linea: '',
                  descripcionLinea: '',
                  codigo: '',
                  descripcion: '',
                };
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
                this.selectedCombinacionSEL = {
                  linea: '',
                  descripcionLinea: '',
                  codigo: '',
                  descripcion: '',
                };
                this.AddTarifa = '';
                this, this.myControl2[0].setValue(this.selectedCombinacionCL);
                this, this.myControls[0].setValue(this.selectedCombinacionACC);
                this.infoCodi = '';
                this.infoDesc = '';
                this.modalService.dismissAll();
              }
            });
          },
          (error) => console.log(error)
        );
      } else {
        //

        if (this.selectedAcabado.value == 'U1') {
          const body = {
            ef_clta: this.codCliente,
            ef_artic: this.infoCodi.substring(0, 4),
            ef_gruix: this.selectedCombinacionGR.codigo,
            ef_acaba: this.selectedCombinacionACC.codigo,
            ef_color: this.selectedCombinacionCL.codigo,
            ef_clas: this.selectedCombinacionSEL.codigo,
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

                  this.selectedPlanchado = {
                    linea: '',
                    descripcionLinea: '',
                    codigo: '',
                    descripcion: '',
                  };
                  this.selectedCombinacionGR = {
                    linea: '',
                    descripcionLinea: '',
                    codigo: '',
                    descripcion: '',
                  };
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
                  this.selectedCombinacionSEL = {
                    linea: '',
                    descripcionLinea: '',
                    codigo: '',
                    descripcion: '',
                  };
                  this.AddTarifa = '';
                  this, this.myControl2[0].setValue(this.selectedCombinacionCL);
                  this,
                    this.myControls[0].setValue(this.selectedCombinacionACC);
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

  BotoncerrarAddEspeci() {
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
  }

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
