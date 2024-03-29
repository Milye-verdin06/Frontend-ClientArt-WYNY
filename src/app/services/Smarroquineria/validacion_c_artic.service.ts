import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { articuloARTRespons, articuloCRespons } from '../../models/cArtic';
import { PeticionesService } from '../peticiones.service';

@Injectable({
  providedIn: 'root',
})
export class Validacion_c_articService {
  constructor(private peticion: PeticionesService) {}

  getArticulosC_artic(body: any): Observable<articuloCRespons> {
    return this.peticion.postQuery('articulos', 'getallinC_artic', body).pipe(
      map((response) => {
        //console.log(response);
        return response;
      })
    );
  }

  postArticuloscArtic(body: any): Observable<articuloARTRespons> {
    return this.peticion.postQuery('articulosArtic', 'post', body).pipe(
      map((response) => {
        //console.log(response);
        return response;
      })
    );
  }
}
