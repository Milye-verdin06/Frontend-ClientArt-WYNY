import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { UsuarioService } from 'src/app/services/usuario.service';
import { clientRespons, listaCliente } from 'src/app/models/Cliente';
import { ArticuloService } from '../../services/articulo.service';
import { articuloRespons} from 'src/app/models/articulo';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ClienteService } from 'src/app/services/cliente.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';


interface Food {
  value: string;
  viewValue: string;
}

interface Unidad {
  id: number;
  value: string;
  viewValue: string;
}
interface UnidadNegocio {
  viewValue: string;
}
@Component({
  selector: 'app-articulos-cliente',
  templateUrl: './articulos-cliente.component.html',
  styles: [],
  providers: [],
})
export class ArticulosClienteComponent implements OnInit {
  

 
  foods: Food[] = [
    { value: '1', viewValue: 'Pesos' },
    { value: '2', viewValue: 'Dolares' },
    { value: '3', viewValue: 'Euros' },
  ];

  unidades: Unidad[] = [
    { id:1, value: 'P', viewValue: 'Pies cuadrados' }, 
    { id:2,value: 'K', viewValue: 'Kilos' },
    { id:3,value: 'D', viewValue: 'Decimetros' },
    { id:4, value: 'L', viewValue: 'Libras' },
    { id:5, value: 'P', viewValue: 'Pares' },
    { id:6,value: 'U', viewValue: 'Unidades' },
    { id:7,value: 'M', viewValue: 'Metros cuadrados' },
  ];
  
   
   
  unidadesN: UnidadNegocio[] = [
    { viewValue: 'Marroquineria' },
    { viewValue: 'Suela' },
    { viewValue: 'Piel' },
    { viewValue: 'Tiras' },
    { viewValue: 'Cintos' },
    { viewValue: 'Suajado' },
  ];
  selectedValue: Food;
  selectedUnidad: Unidad;
  selectedUnidadN: UnidadNegocio;

   public Articulos: any = []
  

  public Clientes: clientRespons[] = [
    //ya se llena automaticamente
  ];

  myControl = new FormControl();
  

  optionsClientes: listaCliente[] = [
  
  ];
 
  filteredOptionsClientes: Observable<listaCliente[]> | undefined;


  constructor(
    private modalService: NgbModal,
    private articuloService: ArticuloService,
    private clienteService: ClienteService,
    private http: HttpClient,
    private router: Router
  ) {
    this.selectedValue = this.foods[1];
    this.selectedUnidad = this.unidades[1];
    this.selectedUnidadN = this.unidadesN[1];
    this.Articulos = [];
    this.Clientes = [];
  }
  open(content: any) {
    this.modalService.open(content, { windowClass: 'mod-class' }).result.then(
      (result) => {},
      (reason) => {}
    );
  }

  ngOnInit() {
 

    console.log(this.selectedUnidad.value);
    const fds = {
      fds: "'126', '125'",
    };
    
  /*   const body = {
      c_codi:  "107211",
     ta_unifa: "D",
     ta_divis: 1} */
     
    this.clienteService.getClientes(fds).subscribe(
      resp => {
        this.optionsClientes = resp.data;
      }, (error) => console.log(error)
      )

      
     
    

    /* this.clienteService.getClientes(fds).subscribe(
      (response: any) => {
        console.log(response);
        this.Clientes = response.data;
      },
      (error) => console.log(error)
    ); */
    

    
    // this.articuloService.getArticulos(body).subscribe((response: any) => {
    //   console.log(response.body);
    //   this.articulos = response.body
    // }, error => console.error(error));

    

    this.filteredOptionsClientes = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.c_nom)),
      
      map((name) =>
        name ? this._filterClientes (name) : this.optionsClientes.slice(),
        
      )
    );
  }

 

  displayFnClientes(cliente: listaCliente): string {
    return cliente && cliente.c_nom ? cliente.c_nom : '' 
    
  }

  

  private _filterClientes(c_nom: string): listaCliente[] {
  
    const filterValue = c_nom.toLowerCase();
    

    

    return this.optionsClientes.filter(
      (option) => option.c_nom.toLowerCase().indexOf(filterValue) === 0 ,
     
    );
  }

    

  botonbuscarArticulos(){
    const body = {
     c_codi:  "701039",
     ta_unifa: "P",
     ta_divis: 2}

   this.articuloService.getArticulos(body).subscribe(
    resp => {
      this.Articulos = resp.data
      
    }, (error) => console.log(error)
    )
   

  }



//para eliminar el articulo
  clickMethod(name: string) {
    if (confirm('Confirmar para eliminar el articulo' + name)) {
    }
  }
  
}
