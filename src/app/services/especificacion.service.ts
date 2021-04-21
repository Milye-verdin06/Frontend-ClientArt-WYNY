import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { especificacionRespons } from 'src/app/models/especificacion';
import { PeticionesService } from './peticiones.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EspecificacionService {
  constructor(private peticion: PeticionesService, private http: HttpClient) {}

  getEspecificacion(body: any): Observable<especificacionRespons> {
    return this.peticion.postQuery('especificaciones', 'getall', body).pipe(
      map((response) => {
        console.log(response);
        return response;
      })
    );
  }
}
