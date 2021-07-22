import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { correoRespons } from '../models/marroquineria/Correo';
import { PeticionesService } from './peticiones.service';

@Injectable({
  providedIn: 'root',
})
export class CorreoService {
  constructor(private peticion: PeticionesService, private http: HttpClient) {}

  postCorreos(body: any): Observable<correoRespons> {
    return this.peticion.postQuery('usuarios', 'correo', body).pipe(
      map((response) => {
        //console.log(response);
        return response;
      })
    );
  }
}
