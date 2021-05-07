import { Injectable } from '@angular/core';
import { ReqArticulos } from '../models/articulo';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  storageKey = 'bodyB';

  constructor() {
    if (localStorage.getItem(this.storageKey) === null) {
      localStorage.setItem(
        this.storageKey,
        JSON.stringify([] as ReqArticulos[])
      );
    }
  }
  GetAll() {
    const articuloB = localStorage.getItem(this.storageKey);
    return JSON.parse(articuloB || '{}') as ReqArticulos[];
  }

  private NewGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }
}
