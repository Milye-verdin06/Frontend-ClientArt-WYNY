import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import {
  FormControl,
  Validators,
  FormGroup,
  FormBuilder,
} from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  ReqLineas,
  ReqFormatos,
  ReqTamanos,
  ReqGrosores,
  ReqColores,
} from 'src/app/models/articulo';
import { ArticuloService } from 'src/app/services/articulo.service';
import { ClienteService } from '../../services/cliente.service';
import { AprobationService } from 'src/app/services/aprobation.service';
import { Location } from '@angular/common';

interface Tambor {
  value: string;
  viewValue: string;
}
interface Formato {
  value: string;
  viewValue: string;
}
interface Tamano {
  value: string;
  viewValue: string;
}

interface Grosor {
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
  public Articulos: any = [];
  public datos_linea: ReqLineas[] = [];
  public datos_formato: ReqFormatos[] = [];
  public datos_tamano: ReqTamanos[] = [];
  public datos_grosor: ReqGrosores[] = [];
  public datos_color: ReqColores[] = [];
  nomCliente: any;

  articuloForm: FormGroup;
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  tambor: Tambor[] = [
    { value: 'L', viewValue: 'Liso' },
    { value: 'T', viewValue: 'Tamboreado' },
    { value: 'M', viewValue: 'Muy tamboreado' },
  ];

  formato: Formato[] = [];

  tamano: Tamano[] = [];

  clasificado: Clasificado[] = [
    { value: 'A' },
    { value: 'B' },
    { value: 'C' },
    { value: 'D' },
  ];
  grosor: Grosor[] = [];

  selectedLinea: ReqLineas;
  selectedTambor: Tambor;
  selectedFormato: ReqFormatos;
  selectedTamano: ReqTamanos;
  selectedGrosor: ReqGrosores;
  selectedClasificado: Clasificado;

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
      listar: ['', Validators.required], //duda
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

    this.articuloService.getcolor().subscribe(
      (resp) => {
        this.datos_color = resp.data;
      },
      (error) => console.log(error)
    );
  }
  selectedLineaNChange(values: any) {}

  onChange() {}
  public useDefault = false;
  toggle(event: MatSlideToggleChange) {
    console.log('Toggle fired');
    this.useDefault = event.checked;
  }
}
