import { Component, OnInit, OnDestroy } from '@angular/core';
import { delay, Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { Usuario } from '../../../models/usuario.model';

import { BusquedasService } from '../../../services/busquedas.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public cantidadUsuarios: number = 0;
  public usuarios?: Usuario[];
  public usuariosTeporales?: Usuario[];

  public imgSubs?: Subscription;
  public desde: number = 0;
  public cargando: boolean = true;


  constructor(private usuarioService: UsuarioService,
              private busquedaService: BusquedasService,
              private modalImagenService: ModalImagenService
              ) { }

  ngOnDestroy(): void {
    // para evitar las fugas de memoria
    this.imgSubs?.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarUsuarios();

    this.imgSubs = this.modalImagenService.nuevaImagen
        .pipe(
          delay(100)
        )
        .subscribe( resp => this.cargarUsuarios());
  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuarioService.cargarUsuarios(this.desde)
      .subscribe(({ total, usuarios }) => {
        this.cantidadUsuarios = total;
        this.usuarios = usuarios;
        this.usuariosTeporales = usuarios;
        this.cargando = false;
      });
  }

  cambiarPagina(valor: number) {
    this.desde += valor;
    if (this.desde < 0) { this.desde = 0 }
    else if (this.desde > this.cantidadUsuarios) { this.desde -= valor }
    this.cargarUsuarios();
  }

  buscar(termino: string) {

    if (!termino) {
      this.usuarios = this.usuariosTeporales;
      return;
    }
    // Devuelve una colección de objetos de tipo 'Usuario'
    this.busquedaService.buscar('usuarios', termino)
      .subscribe(resp => this.usuarios = resp);

  }

  eliminar(usuario: Usuario) {

    if ( usuario.uid === this.usuarioService.userId ) {
      Swal.fire('Error', 'No se puede borrar a usted mismo', 'error');
      return;
    }

    Swal.fire({
      title: '¿Borrar registro?',
      text: `Esta a punto de b borrar a ${usuario.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.eliminar(usuario)
          .subscribe(resp => {
            this.cargarUsuarios();
            Swal.fire(
              'Usuario borrado',
              `${usuario.nombre} fue eliminado correctamente`,
              'success'
            )
          });
      }
    })
  }

  cambiarRole( usuario: Usuario){
    this.usuarioService.actualizarUsuario(usuario)
        .subscribe( resp => {
          console.log(resp);
        });
  }

  abrirModal(user: Usuario | any ){
    this.modalImagenService.abrirModal( 'usuarios', user.uid, user.img );
  }

}
