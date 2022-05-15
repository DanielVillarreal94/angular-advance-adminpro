import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor( private usuarioService: UsuarioService,
               private router: Router ){

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      let esAdmin: boolean = true;
      if ( !(this.usuarioService.role === 'ADMIN_ROLE') ) {
        this.router.navigateByUrl('/dashboard');
        esAdmin = false;
      }
      return esAdmin;
  }

}
