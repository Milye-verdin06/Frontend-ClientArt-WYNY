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
    window.location.replace('http://pedidos.wyny.com.mx:82/'); //redirigir al login
  }
}
