import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PeticionesService {
  private baseUrl: string = environment.apiUrl;
  private baseUrlBase: string = environment.apiUrlBase;

  constructor(private http: HttpClient) {}

  postQuery(tipo: string, accion: string, body: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${environment.token}`,
    });

    const url = `${this.baseUrl}/${tipo}/${accion}`;

    return this.http.post<any>(url, body, { headers });
  }

  getQuery(tipo: string, accion?: string, id?: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${environment.token}`,
    });

    let url = '';
    if (!accion) {
      url = `${this.baseUrl}/${tipo}`;
    } else if (id) {
      url = `${this.baseUrl}/${tipo}/${accion}/${id}`;
    } else {
      url = `${this.baseUrl}/${tipo}/${accion}`;
    }

    return this.http.get<any>(url, { headers });
  }

  getLogin(usr: string, psw: string): Observable<any> {
    const body = new HttpParams()
      .set('username', usr)
      .set('password', psw)
      .set('grant_type', 'password');

    let url = `${this.baseUrlBase}/login`;
    return this.http.post<any>(url, body.toString(), {
      headers: new HttpHeaders().set(
        'Content-Type',
        'application/x-www-form-urlencoded'
      ),
    });
  }

  putQuery(
    tipo: string,
    accion: string,
    body: any,
    id?: number
  ): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${environment.token}`,
    });

    let url = '';
    if (!id) {
      url = `${this.baseUrl}/${tipo}/${accion}`;
    } else {
      url = `${this.baseUrl}/${tipo}/${accion}/${id}`;
    }

    return this.http.put<any>(url, body, { headers });
  }

  deleteQuery(
    tipo: string,
    accion: string,
    id_p?: any,
    id?: number
  ): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${environment.token}`,
    });
    const url = `${this.baseUrl}/${tipo}/${accion}/${id_p}/${id}`;
    return this.http.delete<any>(url, { headers });
  }
}
