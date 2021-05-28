import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { PeticionesService } from '../services/peticiones.service';
import { authenticationService } from '../services/authentication.service';

import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

import { tokenize } from '@angular/compiler/src/ml_parser/lexer';

@Injectable({
  providedIn: 'root',
})
export class GuardsGuard implements CanActivate {
  constructor(
    private authenticationService: authenticationService,
    private PeticionesService: PeticionesService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return true;
  }
}

/*  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (environment.token) {
      console.log(environment.token);

      return true;
    } else {
      console.log(environment.token);
      this.router.navigate(['/no-pagefound']);
      return false;
    }
  } */
