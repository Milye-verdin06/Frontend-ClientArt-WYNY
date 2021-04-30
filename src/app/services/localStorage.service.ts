import { Injectable } from '@angular/core';

const MY_FAVORITES = 'myfavorites';
@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}

  /* private initialStorage():void{
    const currents = JSON.parse(localStorage.getItem(MY_FAVORITES));
    if(!currents){
      localStorage.setItem(MY_FAVORITES, JSON.stringify([]));

    }

  } */
}
