import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  AcabadosRespons,
  ColorACRespons,
  ColorRespons,
  FormatoRespons,
  GrosorRespons,
  LineaRespons,
  SeleccionRespons,
  TamanoRespons,
  TamborRespons,
} from 'src/app/models/marroquineria/articulo';
import { PeticionesService } from '../peticiones.service';

@Injectable({
  providedIn: 'root',
})
export class parametroMService {
  constructor(private peticion: PeticionesService, private http: HttpClient) {}

  getlinea(): Observable<LineaRespons> {
    return this.peticion.getQuery('lineas', 'getall').pipe(
      map((response) => {
        // console.log(response);
        return response;
      })
    );
  }

  getformato(): Observable<FormatoRespons> {
    return this.peticion.getQuery('formatos', 'getall').pipe(
      map((response) => {
        //console.log(response);
        return response;
      })
    );
  }

  gettamano(): Observable<TamanoRespons> {
    return this.peticion.getQuery('tamanos', 'getall').pipe(
      map((response) => {
        //console.log(response);
        return response;
      })
    );
  }

  getgrosor(): Observable<GrosorRespons> {
    return this.peticion.getQuery('grosores', 'getall').pipe(
      map((response) => {
        // console.log(response);
        return response;
      })
    );
  }

  getcolor(body: any): Observable<ColorRespons> {
    return this.peticion.postQuery('colores', 'getall', body).pipe(
      map((response) => {
        // console.log(response);
        return response;
      })
    );
  }
  getColorAC(): Observable<ColorACRespons> {
    return this.peticion.getQuery('colores', 'getallAC').pipe(
      map((response) => {
        //  console.log(response);
        return response;
      })
    );
  }
  getAcabado(): Observable<AcabadosRespons> {
    return this.peticion.getQuery('acabados', 'getall').pipe(
      map((response) => {
        //  console.log(response);
        return response;
      })
    );
  }
  gettambor(): Observable<TamborRespons> {
    return this.peticion.getQuery('tambor', 'getall').pipe(
      map((response) => {
        //console.log(response);
        return response;
      })
    );
  }

  getseleccion(): Observable<SeleccionRespons> {
    return this.peticion.getQuery('seleccion', 'getall').pipe(
      map((response) => {
        //console.log(response);
        return response;
      })
    );
  }
}
