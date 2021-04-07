import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { ArticuloService } from 'src/app/services/articulo.service';

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
 
  articles: any
  constructor(private modalService: NgbModal, private articuloService: ArticuloService) {
    this.selectedValue = this.foods[1];
    this.selectedUnidad = this.unidades [1];

    
  
   }
   open(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
     
    });
  }
  ngOnInit() {
    this.articuloService.getArticulos().subscribe((data)=>{
      console.log(data);
      //this.articles = data ['articles'];
    });

 

}

}