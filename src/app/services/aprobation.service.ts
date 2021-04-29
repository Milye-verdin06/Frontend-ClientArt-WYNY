import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AprobationService {
  private nomCliente: BehaviorSubject<string> = new BehaviorSubject<string>('');

  public nomClientes: Observable<string> = this.nomCliente.asObservable();

  constructor() {}
  public setNombreClinte(nomCliente: string) {
    this.nomCliente.next(nomCliente);
  }

  public getNombreCliente(): Observable<string> {
    return this.nomCliente.asObservable();
  }
}
