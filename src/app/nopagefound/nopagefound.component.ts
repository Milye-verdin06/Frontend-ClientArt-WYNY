import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nopagefound',
  templateUrl: './nopagefound.component.html',
  styles: [],
})
export class NopagefoundComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
  volverInicio() {
    window.location.replace('http://189.194.236.252:83/'); //redirigir al login
  }
}
