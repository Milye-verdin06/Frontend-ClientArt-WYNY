import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  clientRespons,
  listaCliente,
} from 'src/app/models/marroquineria/Cliente';
import { PeticionesService } from './peticiones.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  constructor(private peticion: PeticionesService) {}

  getClientes(fds: any): Observable<clientRespons> {
    return this.peticion.postQuery('clientes', 'getall', fds).pipe(
      map((response) => {
        // console.log(response);
        return response;
      })
    );
  }
}
