import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListaArticulos } from 'src/app/models/articulo';
import { PeticionesService } from './peticiones.service';
import { map } from 'rxjs/operators';

//funciona

@Injectable({
  providedIn: 'root'
})
export class ArticuloService {
 

  constructor(private peticion: PeticionesService) { }


getArticulos(body:any): Observable<ListaArticulos>{
  return this.peticion.postQuery('articulos','getall',body)
  .pipe(
    map(response=>{
      console.log(response);
      return response;
    })
  )
}


 }
