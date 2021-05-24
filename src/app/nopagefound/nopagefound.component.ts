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
    window.location.replace(
      'http://localhost:29944/(S(0z2vafyxw3esalxngavijjdc))/Views/wfLogin.aspx'
    ); //redirigir al login
  }
}
