import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from 'src/app/models/Usuario';
import { PeticionesService } from './peticiones.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  constructor(private peticion: PeticionesService) {}

  getUsuarios(body: any): Observable<Usuario> {
    return this.peticion.postQuery('usuarios', 'getall', body).pipe(
      map((response) => {
        console.log(response);
        return response;
      })
    );
  }
}
