import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AprobationService {
  constructor() {}

  private nomCliente: BehaviorSubject<string> = new BehaviorSubject<string>('');

  public nomClientes: Observable<string> = this.nomCliente.asObservable();

  public setNombreClinte(nomCliente: any) {
    this.nomCliente.next(nomCliente);
  }

  public getNombreCliente(): Observable<string> {
    return this.nomCliente.asObservable();
  }

  private codCliente: BehaviorSubject<string> = new BehaviorSubject<string>('');

  public codClientes: Observable<string> = this.codCliente.asObservable();

  public setCodCliente(codCliente: any) {
    this.codCliente.next(codCliente);
  }

  public getCodCliente(): Observable<string> {
    return this.codCliente.asObservable();
  }

  private unidadSelecc: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );
  public unidadSeleccS: Observable<string> = this.unidadSelecc.asObservable();

  public setUnidadMedida(unidadSelecc: any) {
    this.unidadSelecc.next(unidadSelecc);
  }
  public getUnidadMedida(): Observable<string> {
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

  private unidadNSelecc: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );
  public unidadNSeleccS: Observable<string> = this.unidadNSelecc.asObservable();

  public setUnidadN(unidadNSelecc: any) {
    this.unidadNSelecc.next(unidadNSelecc);
  }
  public getUnidadN(): Observable<string> {
    return this.unidadNSelecc.asObservable();
  }
}
