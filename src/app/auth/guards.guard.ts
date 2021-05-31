import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';

import { PeticionesService } from '../services/peticiones.service';
import { authenticationService } from '../services/authentication.service';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class GuardsGuard implements CanActivate {
  constructor(
    private authenticationService: authenticationService,
    private PeticionesService: PeticionesService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (environment.usr.length > 1) {
      return true;
    } else return false;
  }
}

// this.router.navigate(['/no-pagefound']);
