import { Location } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES } from '../sidebar/sidebar.component';

import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: [],
})
export class NavbarComponent implements OnInit {
  public focus = false;
  public listTitles: any[] = [];
  public location: Location;
  public nombre: string = '';
  constructor(
    location: Location,
    private element: ElementRef,
    private router: Router
  ) {
    this.location = location;
  }

  ngOnInit() {
    this.listTitles = ROUTES.filter((listTitle) => listTitle);
    this.nombre = environment.nom;
  }
  getTitle() {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === '#') {
      titlee = titlee.slice(1);
    }

    for (var item = 0; item < this.listTitles.length; item++) {
      if (this.listTitles[item].path === titlee) {
        return this.listTitles[item].title;
      }
    }
    return 'Dashboard';
  }

  cerrarSesion() {
    Swal.fire({
      title: 'Estas apunto de salir de la sesión',
      icon: 'warning',
      width: 300,

      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#172b4d',
      cancelButtonColor: '#BB3939',
      confirmButtonText: 'Salir',
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.replace('http://wyny.com.mx:82/Views/wfLogin.aspx');
      }
    });
  }
}
