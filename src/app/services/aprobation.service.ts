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

  private unidadSelecc: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );
  public unidadSeleccS: Observable<string> = this.unidadSelecc.asObservable();

  public setUnidadMedida(unidadSelecc: any) {
    this.unidadSelecc.next(unidadSelecc);
  }
  public getUnidadMedidda(): Observable<string> {
    return this.unidadSelecc.asObservable();
  }

  private divisaSelecc: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );
  public divisaSeleccS: Observable<string> = this.divisaSelecc.asObservable();

  public setDivisa(divisaSelecc: any) {
    this.divisaSelecc.next(divisaSelecc);
  }
  public getDivisa(): Observable<string> {
    return this.divisaSelecc.asObservable();
  }
}
