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
 

  foods: Food[] = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'}
  ];

  constructor(

  ) {
    

   }

  ngOnInit(): void {
  }

}
