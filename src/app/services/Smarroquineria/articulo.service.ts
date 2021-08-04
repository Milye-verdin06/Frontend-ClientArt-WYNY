import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ArticuloExisteTarifa,
  articuloRespons,
} from 'src/app/models/marroquineria/articulo';
import { PeticionesService } from '../peticiones.service';
import { map } from 'rxjs/operators';

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
}
