import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { UsuarioService} from 'src/app/services/usuario.service';
import { Cliente } from 'src/app/models/Cliente';
import { AbstractWebDriver } from 'protractor/built/browser';
import { ArticuloService } from '../../services/articulo.service';
import { Articulo } from '../../models/Articulo';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ClienteService } from 'src/app/services/cliente.service';


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

  
  articulos: Articulo [];
  clientes: Cliente[];
 
 
  constructor(private modalService: NgbModal, private articuloService: ArticuloService,private clienteService: ClienteService, private http:HttpClient) {
    this.selectedValue = this.foods[1];
    this.selectedUnidad = this.unidades [1];
    this.articulos = [];
    this.clientes =[];
    
  
   }
   open(content: any) {
    this.modalService.open(content, { windowClass: 'mod-class' }).result.then(
      (result) => {
         
       }, (reason) => {
          
});

   
    
  }
  ngOnInit() {

    const fds = {
      fds: "'126', '125'"
    } 

    this.clienteService.getClientes(fds).subscribe((response: any) =>{
      console.log(response.fds);
      this.clientes = response.fds
    }, error => console.log(error));
    // const body = {
    //   c_codi:  "107211", 
	  //   ta_unifa: "D",
	  //   ta_divis: 1
    
    // }
    // this.articuloService.getArticulos(body).subscribe((response: any) => {
    //   console.log(response.body);
    //   this.articulos = response.body
    // }, error => console.error(error));
    
    }

    clickMethod(name: string) {
      if(confirm("Confirmar para eliminar el articulo" +name)) {
       
      }

    }
}

