import { Component, OnInit } from '@angular/core';



interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-agregar-articulos',
  templateUrl: './agregar-articulos.component.html',
  
})
export class AgregarArticulosComponent implements OnInit {
  
  selectedValue: string 

  foods: Food[] = [
    {value: '1', viewValue: 'Pesos'},
    {value: '2', viewValue: 'Dolares'},
    {value: '3', viewValue: 'Euros'}
  ];


  constructor( ) {this.selectedValue='';
    

   }

  ngOnInit(): void {
  }

}
