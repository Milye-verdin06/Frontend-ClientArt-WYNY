import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { UsuarioService } from 'src/app/services/usuario.service';
import { clientRespons, listaCliente } from 'src/app/models/Cliente';
import { ArticuloService } from '../../services/articulo.service';
import { articuloRespons, ReqArticulos} from 'src/app/models/articulo';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ClienteService } from 'src/app/services/cliente.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { NumberFormatStyle } from '@angular/common';


interface Food {
  value: string;
  viewValue: string;
}

interface Unidad {
  
  value: string;
  viewValue: string;
}
interface UnidadNegocio {
  value: string;
  viewValue: string;
}



@Component({
  selector: 'app-articulos-cliente',
  templateUrl: './articulos-cliente.component.html',
  styles: [],
  providers: [],
})
export class ArticulosClienteComponent implements OnInit, OnDestroy {
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
 
  

 
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
    { value: 'SI', viewValue: 'Marroquineria' },
    { value: 'SU', viewValue: 'Suela' },
    { value: 'PI',viewValue: 'Piel' },
    { value: 'CI',viewValue: 'Tiras' },
    { value: 'CT',viewValue: 'Cintos' },
    { value: 'SS',viewValue: 'Suajado' },
  ];
  selectedValue: Food;
  selectedUnidad: Unidad;
  selectedUnidadN: UnidadNegocio;
  selectedCliente: string;

   public Articulos: any = []
  datos_articulo: ReqArticulos [] =[

  ]

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
    this. selectedCliente = "";
   
    this.Articulos = [];
    this.Clientes = [];
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    
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

     

    this.filteredOptionsClientes = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.c_nom)),
      
      map((name) =>
        name ? this._filterClientes (name) : this.optionsClientes.slice(),
        
      )
    );

    

   this.dtOptions = {
     pagingType: 'full_members',
     pageLength: 5,
     /* language: {
       ur: '//cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish_Mexico.json'
     } */
     lengthMenu: [5, 10, 15],
     processing: true
   };
    
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
     c_codi:  this.selectedCliente,
     ta_unifa: this.selectedUnidad,
     ta_divis: this.selectedValue,
     ar_tpiel: this.selectedUnidadN}

   this.articuloService.getArticulos(body).subscribe(
    resp => {

      this.datos_articulo = resp.data;
      this.dtTrigger.next();
      
      
    }, (error) => console.log(error)
    )
  
  }
  codSelected(codigo: listaCliente){
    this.selectedCliente= codigo.c_codi;
    
  }

//para eliminar el articulo
  clickMethod(name: string) {
    if (confirm('Confirmar para eliminar el articulo' + name)) {
    }
  }
  
}
