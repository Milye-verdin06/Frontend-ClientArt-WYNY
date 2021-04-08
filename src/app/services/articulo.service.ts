import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Articulo } from '../models/articulo';

//verificar este servicio

@Injectable({
  providedIn: 'root'
})
export class ArticuloService {
 
 baseUrl = environment.apiUrl + '/articulos';

  constructor(private http: HttpClient) { }

getArticulo(articuloId: string): Observable<Articulo>{
 const url = this.baseUrl + articuloId;
  return this.http.get<Articulo>(url);
}
getarticulos(): Observable<Articulo[]>{
  return this.http.get<Articulo[]>(this.baseUrl);
}

getUsersWithHeaders(): Observable<any>{
  return this.http.get(this.baseUrl, {observe: 'response'});
}

 }
