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
    window.location.replace('http://192.168.39.202:83/'); //redirigir al login
  }
}
