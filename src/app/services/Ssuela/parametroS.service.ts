import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ColorTenidoRespons,
  CombinacionRespons,
  GrosorRespons,
  LineaRespons,
  PlanchadoRespons,
  TipoGrosorRespons,
} from 'src/app/models/suela/articuloS';
import { PeticionesService } from '../peticiones.service';

@Injectable({
  providedIn: 'root',
})
export class parametroSService {
  constructor(private http: HttpClient, private peticion: PeticionesService) {}

  getlinea(body: any): Observable<LineaRespons> {
    return this.peticion.postQuery('lineaSuela', 'getall', body).pipe(
      map((response) => {
        //console.log(response);
        return response;
      })
    );
  }

  getplanchado(body: any): Observable<PlanchadoRespons> {
    return this.peticion.postQuery('planchadoS', 'getall', body).pipe(
      map((response) => {
        //console.log(response);
        return response;
      })
    );
  }
  getTipoGrosor(body: any): Observable<TipoGrosorRespons> {
    return this.peticion.postQuery('tipoGrosorS', 'getall', body).pipe(
      map((response) => {
        //console.log(response);
        return response;
      })
    );
  }
  getGrosor(body: any): Observable<GrosorRespons> {
    return this.peticion.postQuery('GrosorSuela', 'getall', body).pipe(
      map((response) => {
        //console.log(response);
        return response;
      })
    );
  }

  getcombinacion(body: any): Observable<CombinacionRespons> {
    return this.peticion.postQuery('combinacionS', 'getall', body).pipe(
      map((response) => {
        //console.log(response);
        return response;
      })
    );
  }

  getcolorTenido(body: any): Observable<ColorTenidoRespons> {
    return this.peticion.postQuery('ColorS', 'getall', body).pipe(
      map((response) => {
        //console.log(response);
        return response;
      })
    );
  }
}
