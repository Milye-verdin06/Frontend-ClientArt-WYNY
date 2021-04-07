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
    { value: '1', viewValue: 'Pesos' },
    { value: '2', viewValue: 'Dolares' },
    { value: '3', viewValue: 'Euros' },
  ];


  selectedValue: Food;

  constructor() {
    this.selectedValue = this.foods[1];
  }
  ngOnInit() {}
}
