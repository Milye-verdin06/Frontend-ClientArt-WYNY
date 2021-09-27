import { AprobationService } from 'src/app/services/Smarroquineria/aprobation.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import {
  ColorTenidoRespons,
  ReqColorTenido,
  ReqLineas,
} from 'src/app/models/suela/articuloS';
import { parametroSService } from 'src/app/services/Ssuela/parametroS.service';
import { Validacion_c_articService } from 'src/app/services/Smarroquineria/validacion_c_artic.service';
import { ReqPlanchado, ReqCombinacion } from '../../models/suela/articuloS';
import { map, startWith } from 'rxjs/operators';
import {
  MatAutocomplete,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
import { ReqArtic, ReqcArtic } from 'src/app/models/cArtic';
import { ArticuloService } from 'src/app/services/Smarroquineria/articulo.service';
import {
  ReqArticulos,
  ReqArticulosExistentes,
} from 'src/app/models/marroquineria/articulo';
import { EspecificacionService } from 'src/app/services/Smarroquineria/especificacion.service';
import { CorreoService } from 'src/app/services/correo.service';
import { ReqCorreo } from 'src/app/models/Correo';
import { environment } from 'src/environments/environment';
import { ReqGrosor, ReqTipoGrosor } from '../../models/suela/articuloS';
import { ReqGrosores } from '../../models/marroquineria/articulo';

@Component({
  selector: 'app-agregar-articulosSuela',
  templateUrl: './agregar-articulos suela.component.html',
})
export class AgregarArticulosSuelaComponent implements OnInit {
  @ViewChild('addespecificacion') modalContent: any;
  isDisabledselePlanchado = true; //no permitir seleccionar el planchado, hasta seleccionar la linea
  isDisableRadioTipoGrosor = true; //no permitir el radioBoton de los tipos de grosores hasta seleecionar el planchado
  isDisabledseleGrosor = true; //no permitir seleccionar el grosor, hasta seleccionar el planchado
  isDisabledseleColor = true; //no seleccionar ningun color en el mat-input de Colores

  isDisabledseleAcabado = true; //no seleccionar ningun acabado en el mat-input de acabados

  isDisabledAcabado = true; //deshabilitar el select de acabado hasta que seleccionen el grosor
  isDisabledseleSeleccion = true; //deshabilitar la seleccion hasta que indicas si es tenido, acabado o natural

  isDisabledcoloresNG = false; //ocultar  el select de seleccionar color *ngIf

  nomCliente: any;
  codCliente: any;
  unidadSelecc: any;

  divisaSelecc: any;
  nomDivisa: any;
  unidadNSelecc: any;

  public datos_linea: ReqLineas[] = [];
  public datos_planchado: ReqPlanchado[] = [];
  public datos_tipoGrosor: ReqTipoGrosor[] = [];
  public datos_combinacionGR: ReqGrosor[] = [];
  public datos_combinacionColor: ReqColorTenido[] = [];
  public datos_combinacionAC: ReqCombinacion[] = [];
  public datos_combinacionSEL: ReqCombinacion[] = [];
  public datos_cArtic: ReqcArtic[] = [];
  datos_Addartic: ReqArtic[] = [];
  public nombreVendedor: string = '';

  selectedLinea: ReqLineas;
  selectedPlanchado: ReqPlanchado;
  selectedtipoGrosor: ReqTipoGrosor;
  selectedCombinacionGR: ReqGrosor;
  selectedCombinacionSEL: ReqCombinacion;

  selectedColores: ReqColorTenido;

  selectedAcabado: ReqCombinacion;
  optionsColores: ReqColorTenido[] = [];

  optionsAcabados: ReqCombinacion[] = [];
  datos_articuloenTarifa: ReqArticulosExistentes[] = [];
  datos_articulo: ReqArticulos[] = [];
  aintarifa: number[] = [];
  ainfoDesc: string[] = [];
  ainfoCodigo: string[] = [];
  datos_especificacion: any;

  public Colores: ColorTenidoRespons[] = [];
  public datos_correo: ReqCorreo[] = [];

  myControls: FormControl[] = [new FormControl('')];
  myControl2: FormControl[] = [new FormControl('')];

  constructor(
    private aprobationService: AprobationService,
    private Validacion_c_articService: Validacion_c_articService,
    private router: Router,
    private parametroSService: parametroSService,
    private articuloService: ArticuloService,
    private modalService: NgbModal,
    private especificacionService: EspecificacionService,
    private correoService: CorreoService
  ) {
    this.selectedAcabado = this.datos_combinacionAC[1];
    this.selectedLinea = this.datos_linea[1];
    this.selectedPlanchado = this.datos_planchado[1];
    this.selectedtipoGrosor = this.datos_tipoGrosor[1];
    this.selectedCombinacionGR = this.datos_combinacionGR[1];
    this.selectedCombinacionSEL = this.datos_combinacionSEL[1];
    this.selectedColores = this.datos_combinacionColor[1];
  }

  ngOnInit() {
    this.nombreVendedor = environment.nom;

    this._servicetoVar();

    const bodyLS = {
      tp_unidad: this.unidadSelecc,
      tp_vl_un: '2',
    };
    this.parametroSService.getlinea(bodyLS).subscribe(
      (resp) => {
        this.datos_linea = resp.data;
      },
      (error) => console.log(error)
    );
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
  mostrarTipoGrosor() {
    const body = {
      vLinea: this.selectedLinea.tp_codi,
    };
    this.parametroSService.getTipoGrosor(body).subscribe(
      (resp) => {
        this.datos_tipoGrosor = resp.data;
      },
      (error) => console.log(error)
    );
  }
  mostrarGrosor() {
    const body = {
      vLinea: this.selectedLinea.tp_codi,
      vTipo: this.selectedtipoGrosor.tg_tipo,
    };
    this.parametroSService.getGrosor(body).subscribe(
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
  }
  mostrarcolor() {
    const body = {
      vLinea: this.selectedLinea.tp_codi,
      vAcaba: this.selectedAcabado.codigo,
    };
    this.parametroSService.getcolorTenido(body).subscribe(
      (resp) => {
        this.optionsColores = resp.data;
      },
      (error) => console.log(error)
    );
  }

  selectedLineaChange(values: ReqLineas) {
    this.mostrarPlanchado();
    this.isDisabledselePlanchado = false;
    this.mostrarTipoGrosor();

    this.mostrarAcabado();
    //this.mostrarcolor();

    this.mostrarClasificacion();

    this.isDisabledcoloresNG = false; //no mostrar select de colores

    this.selectedPlanchado = {
      linea: '',
      descripcionLinea: '',
      codigo: '',
      descripcion: '',
    };

    this.selectedtipoGrosor = {
      tg_tipo: '',
      tg_nombre: '',
    };
    this.selectedCombinacionGR = {
      gr_codi: '',
      gr_desce: '',
    };
    this.selectedAcabado = {
      linea: '',
      descripcionLinea: '',
      codigo: '',
      descripcion: '',
    };

    this.selectedColores = {
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

    this.isDisableRadioTipoGrosor = true;
    this.isDisabledseleGrosor = true;
    this.isDisabledAcabado = true;
    this.isDisabledseleSeleccion = true; //deshabilitar la seleccion hasta que indicas si es tenido, acabado o natural
    this.isDisabledcoloresNG = false; //ocultar  el select de seleccionar color *ngIf
  }

  selectedPlanchadoChange(values: ReqPlanchado) {
    this.isDisableRadioTipoGrosor = false;

    this.selectedtipoGrosor = {
      tg_tipo: '',
      tg_nombre: '',
    };
    this.selectedCombinacionGR = {
      gr_codi: '',
      gr_desce: '',
    };
    this.selectedAcabado = {
      linea: '',
      descripcionLinea: '',
      codigo: '',
      descripcion: '',
    };

    this.selectedColores = {
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
    this.isDisabledcoloresNG = false; //ocultar  el select de seleccionar color *ngIf

    this.mostrarInfo();
    this.mostrarCodigo();
  }
  selectedGrosorChange(values: ReqCombinacion) {
    this.selectedAcabado = {
      linea: '',
      descripcionLinea: '',
      codigo: '',
      descripcion: '',
    };

    this.selectedColores = {
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
    this.isDisabledcoloresNG = false; //ocultar  el select de seleccionar color *ngIf

    this.mostrarInfo();
    this.mostrarCodigo();
    const bodyC = {
      codigoTarifa: this.infoCodi.substring(0, 4),
    };

    this.Validacion_c_articService.getArticulosC_artic(bodyC).subscribe(
      (resp) => {
        this.datos_cArtic = resp.data;
        if (this.datos_cArtic.length == 1) {
          this.isDisabledAcabado = false;
        } else if (this.datos_cArtic.length == 0) {
          const body = {
            ar_artic: this.infoCodi.substring(0, 4),
            ar_desce: this.infoDescC_ARTIC.trim(),
            ar_desci: this.infoDescC_ARTIC.trim(),

            ar_unid: this.unidadSelecc,
            ar_tpiel: this.selectedLinea.tp_codi,
            ar_fami: 1,
          };

          this.Validacion_c_articService.postArticuloscArtic(body).subscribe(
            (resp) => {
              this.datos_Addartic = resp.data;
            },
            (error) => console.log(error)
          );
        }
      },
      (error) => console.log(error)
    );
  }
  selectAcabadoChangue(values: any) {
    this.mostrarcolor();
    this.isDisabledseleSeleccion = true;
    this.isDisabledseleColor = false;
    this.isDisabledcoloresNG = true;

    if (this.selectedAcabado.codigo == 'NA') {
      this.isDisabledseleSeleccion = false;
      this.isDisabledcoloresNG = false;
      this.selectedColores = {
        linea: '',
        descripcionLinea: '',
        codigo: '',
        descripcion: '',
      };
    }

    this.selectedColores = {
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
  selectColorChangue(values: ReqColorTenido) {
    this.isDisabledseleSeleccion = false;
    this.selectedCombinacionSEL = {
      linea: '',
      descripcionLinea: '',
      codigo: '',
      descripcion: '',
    };
    this.mostrarInfo();
    this.mostrarCodigo();
  }
  selectedClasificacionChange(values: ReqCombinacion) {
    this.mostrarInfo();
    this.mostrarCodigo();
  }
  selectedtipogrosorChange() {}

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

  infoDescC_ARTIC: string = '';
  infoCodi: string = '';
  infoDesc: string = '';
  infoEspeci: string = '';
  infoLinea: string = '';
  infoplanchado: string = '';
  infoGrosor: string = '';
  infoSeleccion: string = '';
  infoAcabado: string = '';
  infoColor: string = '';

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
      ? String(this.selectedCombinacionGR.gr_desce).trim()
      : ' ';
    this.infoAcabado = this.selectedAcabado.descripcion
      ? String(this.selectedAcabado.descripcion).trim()
      : '';
    this.infoColor = this.selectedColores.descripcion
      ? String(this.selectedColores.descripcion).trim()
      : '';

    this.infoSeleccion = this.selectedCombinacionSEL.descripcion //mostrar el valor del mat-selected NATURAL 'NA' TENIDO 'TC'
      ? String(this.selectedCombinacionSEL.descripcion).trim()
      : ' ';

    this.infoDesc =
      this.infoLinea +
      ' ' +
      this.infoplanchado +
      ' ' +
      this.infoGrosor +
      ' ' +
      this.infoAcabado +
      ' ' +
      this.infoColor +
      ' ' +
      this.infoSeleccion;

    this.infoDescC_ARTIC =
      this.infoLinea.trim() + ' ' + this.infoplanchado.trim();
  }

  mostrarCodigo() {
    this.infoLinea = this.selectedLinea
      ? String(this.selectedLinea.tp_desc).trim().substr(-22, 2)
      : '';
    this.infoplanchado = this.selectedPlanchado
      ? String(this.selectedPlanchado.codigo).trim()
      : '';

    this.infoGrosor = this.selectedCombinacionGR
      ? String(this.selectedCombinacionGR.gr_codi).trim()
      : '';
    this.infoAcabado = this.selectedAcabado.codigo
      ? String(this.selectedAcabado.codigo).trim()
      : '';

    this.infoColor = this.selectedColores.codigo
      ? String(this.selectedColores.codigo).trim()
      : '';

    this.infoSeleccion = this.selectedCombinacionSEL
      ? String(this.selectedCombinacionSEL.codigo).trim()
      : '';

    this.infoCodi =
      this.infoLinea +
      '' +
      this.infoplanchado +
      '' +
      this.infoequis +
      ' ' +
      this.infoGrosor +
      ' ' +
      this.infoAcabado +
      ' ' +
      this.infoColor +
      ' ' +
      this.infoSeleccion;
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
        this.selectedAcabado.codigo == 'TC' &&
        this.selectedColores.codigo == ''
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
          this.selectedAcabado.codigo != 'NA' &&
          this.selectedColores.codigo == ''
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
              const bodyE = {
                ta_clta: this.codCliente,
                ta_artic: this.infoCodi.substring(0, 4),
                ta_gruix: this.selectedCombinacionGR.gr_codi,
                ta_acaba: 'NA',
                ta_color: '9',
                ta_clas: this.selectedCombinacionSEL.codigo,
                ta_unifa: this.unidadSelecc,
                ta_divis: this.divisaSelecc,
                ta_tarif_001: this.AddTarifa,
                ta_tarif_002: '',
              };
              this.articuloService.getArticulosinTarifa(bodyE).subscribe(
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
                    if (this.selectedAcabado.codigo == 'NA') {
                      this.ainfoDesc.push(this.infoDesc);
                      this.ainfoCodigo.push(this.infoCodi);
                      this.aintarifa.push(this.AddTarifa);
                      const bodyNAA = {
                        ta_codi: 'C',
                        ta_clta: this.codCliente,
                        ta_artic: this.infoCodi.substring(0, 4),
                        ta_gruix: this.selectedCombinacionGR.gr_codi,
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
                                ef_gruix: this.selectedCombinacionGR.gr_codi,
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
                                un_unidad: '',
                                tp_unidad: '',
                                un_nombre: '',
                                tp_vl_un: '',
                              };

                              this.selectedPlanchado = {
                                linea: '',
                                descripcionLinea: '',
                                codigo: '',
                                descripcion: '',
                              };
                              this.selectedCombinacionGR = {
                                gr_codi: '',
                                gr_desce: '',
                              };
                              this.selectedAcabado = {
                                linea: '',
                                descripcionLinea: '',
                                codigo: '',
                                descripcion: '',
                              };

                              this.selectedColores = {
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
                ta_gruix: this.selectedCombinacionGR.gr_codi,
                ta_acaba: this.selectedAcabado.codigo,
                ta_color: this.selectedColores.codigo,
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
                    if (this.selectedAcabado.codigo != 'NA') {
                      this.ainfoDesc.push(this.infoDesc);
                      this.ainfoCodigo.push(this.infoCodi);
                      this.aintarifa.push(this.AddTarifa);
                      const bodyTC = {
                        ta_codi: 'C',
                        ta_clta: this.codCliente,
                        ta_artic: this.infoCodi.substring(0, 4),
                        ta_gruix: this.selectedCombinacionGR.gr_codi,
                        ta_acaba: this.selectedAcabado.codigo,
                        ta_color: this.selectedColores.codigo,
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
                                  ef_gruix: this.selectedCombinacionGR.gr_codi,
                                  ef_acaba: this.selectedAcabado.codigo,
                                  ef_color: this.selectedColores.codigo,
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
                                  un_unidad: '',
                                  tp_unidad: '',
                                  un_nombre: '',
                                  tp_vl_un: '',
                                };

                                this.selectedPlanchado = {
                                  linea: '',
                                  descripcionLinea: '',
                                  codigo: '',
                                  descripcion: '',
                                };
                                this.selectedCombinacionGR = {
                                  gr_codi: '',
                                  gr_desce: '',
                                };
                                this.selectedAcabado = {
                                  linea: '',
                                  descripcionLinea: '',
                                  codigo: '',
                                  descripcion: '',
                                };

                                this.selectedColores = {
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
    if (this.selectedAcabado.codigo == 'NA') {
      const body = {
        ef_clta: this.codCliente,
        ef_artic: this.infoCodi.substring(0, 4),
        ef_gruix: this.selectedCombinacionGR.gr_codi,
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
                un_unidad: '',
                un_nombre: '',
                tp_vl_un: '',
                tp_unidad: '',
              };

              this.selectedPlanchado = {
                linea: '',
                descripcionLinea: '',
                codigo: '',
                descripcion: '',
              };
              this.selectedCombinacionGR = {
                gr_codi: '',
                gr_desce: '',
              };
              this.selectedAcabado = {
                linea: '',
                descripcionLinea: '',
                codigo: '',
                descripcion: '',
              };

              this.selectedColores = {
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
      if (this.selectedAcabado.codigo != 'NA') {
        const body = {
          ef_clta: this.codCliente,
          ef_artic: this.infoCodi.substring(0, 4),
          ef_gruix: this.selectedCombinacionGR.gr_codi,
          ef_acaba: this.selectedAcabado.codigo,
          ef_color: this.selectedColores.codigo,
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
                  un_unidad: '',
                  un_nombre: '',
                  tp_vl_un: '',
                  tp_unidad: '',
                };

                this.selectedPlanchado = {
                  linea: '',
                  descripcionLinea: '',
                  codigo: '',
                  descripcion: '',
                };
                this.selectedCombinacionGR = {
                  gr_codi: '',
                  gr_desce: '',
                };
                this.selectedAcabado = {
                  linea: '',
                  descripcionLinea: '',
                  codigo: '',
                  descripcion: '',
                };
                this.selectedColores = {
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
          if (this.ainfoDesc.length == 0 && this.ainfoCodigo.length == 0) {
          } else {
            this.sendEmail();
          }
        }

        this.isHomeRoute();
      }
    });
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
      to: 'jperez@wyny.com.mx',

      subject: `Alta artículo - ${this.nomCliente}`,

      message: `<div>
      <h1 style="font-family: Arial">&nbsp;&nbsp;Registro de nuevo articulo </h1>
                    <a>
                    <img src="https://i.mkt.lu/dl/thumb/7444781040/7188581810.jpg" width="150" height="150" border="0" alt="" style="float:left">
                    </a>


              <h5 style="font-family: Arial"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Vendedor: ${this.nombreVendedor}</h5>
              <h5 style="font-family: Arial"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Cliente: ${this.nomCliente}</h5>
              <h5 style="font-family: Arial"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Código cliente: ${this.codCliente}</h5>
              <h5 style="font-family: Arial"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Unidad de negocio: Suela </h5>
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

      cc: 'daniel_berger@wyny.com.mx, iracheta@wyny.mx, ramon_hernandez@wyny.com.mx, mili_verdin@wyny.com.mx',
    };

    this.correoService.postCorreos(body).subscribe(
      (resp) => {
        this.datos_correo = resp.data;
      },
      (error) => console.log(error)
    );
  }

  sendEmailc_artic() {
    const body = {
      to: 'mili_verdin@wyny.com.mx',

      subject: `Registro nuevo en C_artic- ${this.nomCliente}`,

      message: `<div>
      <h1 style="font-family: Arial">&nbsp;&nbsp;Registro de articulo en C_ARTIC </h1>
                    <a>
                    <img src="https://i.mkt.lu/dl/thumb/7444781040/7188581810.jpg" width="150" height="150" border="0" alt="" style="float:left">
                    </a>


              <h5 style="font-family: Arial"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Vendedor: ${
                this.nombreVendedor
              }</h5>
              <h5 style="font-family: Arial"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Unidad de negocio: Suela</h5>
              <h5 style="font-family: Arial"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Unidad de medida: ${
                this.unidadSelecc
              } </h5>
              <h5 style="font-family: Arial"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Divisa: ${
                this.divisaSelecc
              } </h5>
              <h5 style="font-family: Arial"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Articulo: ${this.infoCodi.substring(
                0,
                4
              )} </h5>
              <h5 style="font-family: Arial"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Descripcion: ${
                this.infoDescC_ARTIC
              } </h5>
              </div>
              <br>
              <br>
              <br>

           <h6 style="font-family: Arial" align="center"> Este mensaje se envió de manera automática, favor de NO responder,
           en caso de alguna aclaración favor de contactar con su ejecutivo de cuenta.
           </h6> `,

      cc: 'iracheta@wyny.mx, ramon_hernandez@wyny.com.mx',
    };

    this.correoService.postCorreos(body).subscribe(
      (resp) => {
        this.datos_correo = resp.data;
      },
      (error) => console.log(error)
    );
  }

  RadioTipoGrosorChange(values: ReqTipoGrosor) {
    this.mostrarGrosor();
    this.isDisabledseleGrosor = false;
  }
  selectedRadio: boolean = true;
  mostrarTGrosoresRadio(e: any) {
    //this.selectedRadio = e.value;
    this.selectedCombinacionGR = {
      gr_codi: '',
      gr_desce: '',
    };
  }
}
