import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { UsuarioService} from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario';


interface Food {
  value: string;
  viewValue: string;
}

interface Unidad {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-articulos-cliente',
  templateUrl: './articulos-cliente.component.html',
  styles: [
  ]
})
export class ArticulosClienteComponent implements OnInit  {
  
 
  foods: Food[] = [
    { value: '1', viewValue: 'Pesos' },
    { value: '2', viewValue: 'Dolares' },
    { value: '3', viewValue: 'Euros' },
   
  ];

  unidades: Unidad[] = [
    { value: 'P', viewValue: 'Pies cuadrados' },
    { value: 'K', viewValue: 'Kilos' },
    { value: 'D', viewValue: 'Decimetros' },
    { value: 'L', viewValue: 'Libras' },
    { value: 'P', viewValue: 'Pares' },
    { value: 'U', viewValue: 'Unidades' },
    { value: 'M', viewValue: 'Metros cuadrados' },
  ];


  selectedValue: Food;
  selectedUnidad: Unidad;

  usuarios: Usuario[];
 
 
  constructor(private modalService: NgbModal, private usuarioService: UsuarioService) {
    this.selectedValue = this.foods[1];
    this.selectedUnidad = this.unidades [1];
    this.usuarios = [];
    
  
   }
   open(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      
    });
    
  }
  ngOnInit() {
    this.usuarioService.getUsuariosWithHeaders().subscribe((response: any) => {
      console.log(response);
      this.usuarios = response.body
    }, error => console.error(error));
    
    }
}

