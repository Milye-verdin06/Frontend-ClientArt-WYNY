import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  AcabadosRespons,
  ArticuloExisteTarifa,
  articuloRespons,
  ColorRespons,
  FormatoRespons,
  GrosorRespons,
  SeleccionRespons,
  TamanoRespons,
  TamborRespons,
  ColorACRespons,
} from 'src/app/models/marroquineria/articulo';
import { PeticionesService } from '../peticiones.service';
import { map } from 'rxjs/operators';
import { LineaRespons } from '../../models/marroquineria/articulo';

//funciona

@Injectable({
  providedIn: 'root',
})
export class ArticuloService {
  constructor(private peticion: PeticionesService, private http: HttpClient) {}

  getArticulos(body: any): Observable<articuloRespons> {
    return this.peticion.postQuery('articulos', 'getall', body).pipe(
      map((response) => {
        //console.log(response);
        return response;
      })
    );
  }

  putArticulos(body: any): Observable<articuloRespons> {
    return this.peticion.putQuery('articulos', 'put', body).pipe(
      map((response) => {
        // console.log(response);
        return response;
      })
    );
  }

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
  putInactivarArticulos(body: any): Observable<articuloRespons> {
    return this.peticion.putQuery('articulos', 'delete', body).pipe(
      map((response) => {
        // console.log(response);
        return response;
      })
    );
  }

  putActivarctivarArticulos(body: any): Observable<articuloRespons> {
    return this.peticion.putQuery('articulos', 'activararticulo', body).pipe(
      map((response) => {
        // console.log(response);
        return response;
      })
    );
  }
  postArticulos(body: any): Observable<articuloRespons> {
    return this.peticion.postQuery('articulos', 'post', body).pipe(
      map((response) => {
        // console.log(response);
        return response;
      })
    );
  }

  getArticulosinTarifa(body: any): Observable<ArticuloExisteTarifa> {
    return this.peticion.postQuery('articulos', 'searchTarifa', body).pipe(
      map((response) => {
        // console.log(response);
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
