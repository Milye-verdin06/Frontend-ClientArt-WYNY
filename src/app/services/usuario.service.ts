import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from 'src/app/models/Usuario';



@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
 
 baseURL = environment.apiUrl + '/login';

  constructor(private http: HttpClient) { }

getUsuario(usuarioId: string): Observable<Usuario>{
 const url = this.baseURL + usuarioId;
  return this.http.get<Usuario>(url);
}
getUsuarios(): Observable<Usuario[]>{
  return this.http.get<Usuario[]>(this.baseURL);
}

getUsuariosWithHeaders(): Observable<any>{
  return this.http.get(this.baseURL, {observe: 'response'});
}

 }