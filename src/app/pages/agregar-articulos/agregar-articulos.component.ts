import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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

  tamano: Tamano[] = [
    
  ];

  clasificado: Clasificado[]=[
    { value: 'A' },
    { value: 'B'},
    { value: 'C'},
    { value: 'D' },

  ];
  grosor: Grosor[] = [];
  

  selectedLinea: Linea;
  selectedTambor: Tambor;
  selectedFormato: Formato;
  selectedTamano: Tamano;
  selectedGrosor: Grosor;
  selectedClasificado: Clasificado; 
  
  

  constructor(private modalService: NgbModal) {
    this.selectedLinea = this.lineas[1];
    this.selectedTambor = this.tambor[1];
    this.selectedFormato = this.formato[1];
    this.selectedTamano = this.tamano[1];
    this.selectedClasificado = this.clasificado[1];
    this.selectedGrosor = this.grosor [1];
    
  }

  open(content: any) {
    this.modalService.open(content, { windowClass: 'mod-class' }).result.then(
      (result) => {
         
       }, (reason) => {
          
});
  
  }
  ngOnInit() {}

  onChange(){
    
  }
  public useDefault = false;
  toggle(event: MatSlideToggleChange) {
    console.log('Toggle fired');
    this.useDefault = event.checked;
  }

  
}
