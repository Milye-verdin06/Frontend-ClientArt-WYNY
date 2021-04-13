import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { UsuarioService} from 'src/app/services/usuario.service';
import { listaCliente,  } from 'src/app/models/Cliente';
import { ArticuloService } from '../../services/articulo.service';
import { Articulo } from '../../models/Articulo';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ClienteService } from 'src/app/services/cliente.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';





interface Food {
  value: string;
  viewValue: string;
}

interface Unidad {
  value: string;
  viewValue: string;
}
interface UnidadNegocio {
 
  viewValue: string;
}
@Component({
  selector: 'app-articulos-cliente',
  templateUrl: './articulos-cliente.component.html',
  styles: [
  ],
  providers:[]
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

  unidadesN: UnidadNegocio[] = [
    {  viewValue: 'Marroquineria' },
    {  viewValue: 'Suela' },
    {  viewValue: 'Piel' },
    {  viewValue: 'Tiras' },
    {  viewValue: 'Cintos' },
    {  viewValue: 'Suajado' },
    
  ];
  selectedValue: Food;
  selectedUnidad: Unidad;
  selectedUnidadN: UnidadNegocio;

  
  articulos: Articulo [];
  clientes: listaCliente[];

 
  myControl = new FormControl();
  listclientes: listaCliente[] = [
   
  ];
  filteredOptions: Observable<listaCliente[]> | undefined;
 
  constructor(private modalService: NgbModal, 
    private articuloService: ArticuloService,
    private clienteService: ClienteService,
     private http:HttpClient, private router:Router) {


    this.selectedValue = this.foods[1];
    this.selectedUnidad = this.unidades [1];
    this.selectedUnidadN = this.unidadesN [1];
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
      this.clientes = response.fds;
      
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


    this.filteredOptions = this.myControl.valueChanges
    .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(name => name ? this._filter(name) : this.listclientes.slice())
    );

   
    
    }
    displayFn(user: listaCliente): string {
      return user && user.c_nom ? user.c_nom : '';
    }
  
    private _filter(name: string): listaCliente[] {
      const filterValue = name.toLowerCase();
  
      return this.listclientes.filter(option => option.c_nom.toLowerCase().indexOf(filterValue) === 0);
    }

    clickMethod(name: string) {
      if(confirm("Confirmar para eliminar el articulo" +name )) {
       
      }

    }
}

