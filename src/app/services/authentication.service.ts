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
export class authenticationService {
  private frase: Usuario = {
    username: 'VTA126',
    password: 'FloUli126',
    clv: 'password',
  };
  private Url = 'http://192.168.39.238:86/login'; // URL to web api

  constructor(private peticion: PeticionesService, private http: HttpClient) {}

  public getFrase(): Observable<Usuario> {
    return this.http.get<Usuario>(this.Url);
  }
}
