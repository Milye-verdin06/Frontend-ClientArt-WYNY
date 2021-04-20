import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { articuloRespons } from 'src/app/models/articulo';
import { PeticionesService } from './peticiones.service';
import { map } from 'rxjs/operators';

//funciona

@Injectable({
  providedIn: 'root'
})
export class ArticuloService {
 

  constructor(private peticion: PeticionesService, private http:HttpClient) { }


getArticulos(body:any): Observable<articuloRespons>{
  return this.peticion.postQuery('articulos','getall',body)
  .pipe(
    map(response=>{
      console.log(response);
      return response;
    })
  )
}

putArticulos(body:any): Observable<articuloRespons> {
 return this.peticion.putQuery('articulos','put',body)
  .pipe(
    map(response=>{
      console.log(response);
      return response;
    })
  )
}


 }
