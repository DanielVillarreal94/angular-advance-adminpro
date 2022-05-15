import { Component } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent {
  usuario?: Usuario;
  public mostrarBuscador: boolean = false;

  constructor( private usuarioServices: UsuarioService,
                private router: Router) {
    this.usuario = usuarioServices.usuario;
    console.log(this.usuario?.traerImagen);
  }

  logout(){
    this.usuarioServices.logout();
  }

  // Se adicionó a sharedModule le RouterModule para
  // evitar recargar la página al momento de buscar una palabra
  buscar(termino: string){
    this.mostrarBuscador = false;
    if (!termino) {
      this.router.navigateByUrl('/dashboard');
      return;
    }
    this.router.navigateByUrl(`/dashboard/buscar/${ termino }`);
  }

  mostrarB(){
    this.mostrarBuscador = true;
  }

  ocultarB(){
    this.mostrarBuscador = false;
  }
}
