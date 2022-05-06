import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { FileUploadService } from '../../services/file-upload.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {

  public perfilForm: FormGroup | any;//hay problemas con las declaraciones de las variables por eso se agrega any
  public usuario?: Usuario | any;
  public imagenSubir: File | any;
  public imagenUsuario: string = '';
  public imagenTemporal: any = '';

  constructor(private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private fileUploadService: FileUploadService)
  {
    this.usuario = this.usuarioService.usuario;
  }

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      nombre: [this.usuario?.nombre, Validators.required],
      email: [this.usuario?.email, [Validators.required, Validators.email]],
    });
  }

  actualizarPerfil() {
    this.usuarioService.actualizarPerfil(this.perfilForm.value)
      .subscribe((resp: any) => {
        const { nombre, email } = resp.usuario;
        this.usuario.nombre = nombre;
        this.usuario.email = email;
        Swal.fire('Guardar', 'Los cambios se han actualizado con exito', 'success');
      }, (err) => {
        Swal.fire('Error', err.error.msg, 'error');
      });
  }

  cargarImagen(event: Event | any) {
    this.imagenSubir = event.target.files[0];
    if ( !event.target.files[0] ) {
      this.imagenTemporal = null;
      return;
    }

    this.mostrarImagenTemporal(event.target.files[0]);
  }

  subirImagen() {
    this.fileUploadService.actualizarFoto(this.imagenSubir, 'usuarios', this.usuario.uid)
      .subscribe( (resp: any) => {
        this.usuario.img = resp.nombreArchivo
        Swal.fire('👌', 'La imagen se ha actualizado!!!', 'success')
      }, (err) => {
        Swal.fire('Error', err.error.msg, 'error')
      });
  }

  mostrarImagenTemporal(file: File){
    const reader = new FileReader();
    reader.readAsDataURL( file );
    reader.onloadend = () => {
      this.imagenTemporal = reader.result;
    }
  }

}
