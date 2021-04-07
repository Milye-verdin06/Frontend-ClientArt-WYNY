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
  
  
  foods = [
    {value: '1', viewValue: 'Pesos'},
    {value: '2', viewValue: 'Dolares'},
    {value: '3', viewValue: 'Euros'}
  ];
  
  selectedValue= this.foods[1];

  constructor( ) {
    

   }

  ngOnInit(){
    console.log(this.selectedValue);
  }
}