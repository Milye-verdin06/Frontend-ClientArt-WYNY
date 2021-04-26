import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  articuloRespons,
  ColorRespons,
  FormatoRespons,
  GrosorRespons,
  TamanoRespons,
} from 'src/app/models/articulo';
import { PeticionesService } from './peticiones.service';
import { map } from 'rxjs/operators';
import { LineaRespons } from '../models/articulo';

//funciona

@Injectable({
  providedIn: 'root',
})
export class ArticuloService {
  constructor(private peticion: PeticionesService, private http: HttpClient) {}

  getArticulos(body: any): Observable<articuloRespons> {
    return this.peticion.postQuery('articulos', 'getall', body).pipe(
      map((response) => {
        console.log(response);
        return response;
      })
    );
  }

  putArticulos(body: any): Observable<articuloRespons> {
    return this.peticion.putQuery('articulos', 'put', body).pipe(
      map((response) => {
        console.log(response);
        return response;
      })
    );
  }

  getlinea(): Observable<LineaRespons> {
    return this.peticion.getQuery('lineas', 'getall').pipe(
      map((response) => {
        console.log(response);
        return response;
      })
    );
  }

  getformato(): Observable<FormatoRespons> {
    return this.peticion.getQuery('formatos', 'getall').pipe(
      map((response) => {
        console.log(response);
        return response;
      })
    );
  }

  gettamano(): Observable<TamanoRespons> {
    return this.peticion.getQuery('tamanos', 'getall').pipe(
      map((response) => {
        console.log(response);
        return response;
      })
    );
  }

  getgrosor(): Observable<GrosorRespons> {
    return this.peticion.getQuery('grosores', 'getall').pipe(
      map((response) => {
        console.log(response);
        return response;
      })
    );
  }

  getcolor(): Observable<ColorRespons> {
    return this.peticion.getQuery('colores', 'getall').pipe(
      map((response) => {
        console.log(response);
        return response;
      })
    );
  }
}
