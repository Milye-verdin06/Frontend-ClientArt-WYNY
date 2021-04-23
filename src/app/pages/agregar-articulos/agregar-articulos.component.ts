import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  Validators,
  FormGroup,
  FormBuilder,
} from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReqLineas } from 'src/app/models/articulo';
import { ArticuloService } from 'src/app/services/articulo.service';

interface Linea {
  value: string;
  viewValue: string;
}
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
  datos_linea: ReqLineas[] = [];
  articuloForm: FormGroup;
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  lineas: Linea[] = [];

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

  selectedLinea: Linea;
  selectedTambor: Tambor;
  selectedFormato: Formato;
  selectedTamano: Tamano;
  selectedGrosor: Grosor;
  selectedClasificado: Clasificado;

  constructor(
    private articuloService: ArticuloService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private aRouter: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {
    this.selectedLinea = this.lineas[1];
    this.selectedTambor = this.tambor[1];
    this.selectedFormato = this.formato[1];
    this.selectedTamano = this.tamano[1];
    this.selectedClasificado = this.clasificado[1];
    this.selectedGrosor = this.grosor[1];
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
      //listar: ['', Validators.required], duda
    });
  }

  open(content: any) {
    this.modalService.open(content, { windowClass: 'mod-class' }).result.then(
      (result) => {},
      (reason) => {}
    );
  }
  body: any;
  ngOnInit() {
    this.articuloService.getlinea(this.body).subscribe(
      (resp) => {
        this.datos_linea = resp.data;
        console.log(this.datos_linea);
      },
      (error) => console.log(error)
    );
  }

  onChange() {}
  public useDefault = false;
  toggle(event: MatSlideToggleChange) {
    console.log('Toggle fired');
    this.useDefault = event.checked;
  }
}
