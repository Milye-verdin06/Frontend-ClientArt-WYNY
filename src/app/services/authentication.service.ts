import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Usuario, UsuarioRespons } from 'src/app/models/Usuario';
import { PeticionesService } from './peticiones.service';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class authenticationService {
  constructor(private peticion: PeticionesService, private http: HttpClient) {}

  login(usr: string, psw: string): Observable<UsuarioRespons> {
    return this.peticion.getLogin(usr, psw).pipe(
      map((response) => {
        return response;
      })
    );
  }

  loginUsuario(body: any): Observable<Usuario> {
    return this.peticion.postQuery('usuarios', 'login', body).pipe(
      map((response) => {
        // console.log(response);
        return response.data;
      })
    );
  }
}
