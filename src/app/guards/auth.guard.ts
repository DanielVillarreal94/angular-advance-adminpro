import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor( private usuarioSerice: UsuarioService,
                private router: Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot){

      return this.usuarioSerice.validarToken()
                  .pipe(
                    tap( resp => {
                      if( !resp ) this.router.navigateByUrl('login')
                    })
                  );
  }

}
