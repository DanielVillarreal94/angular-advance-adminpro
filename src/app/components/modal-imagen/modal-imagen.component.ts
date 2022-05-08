import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { FileUploadService } from 'src/app/services/file-upload.service';
import { ModalImagenService } from '../../services/modal-imagen.service';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [
  ]
})
export class ModalImagenComponent implements OnInit {

  public imagenSubir: File | any;
  public imagenTemporal: any = '';

  public valorInputFile: string = '';

  constructor( public modalImagenService: ModalImagenService,
                private fileUploadService: FileUploadService) {
  }

  ngOnInit(): void {
  }

  cerrarModal( inputFile: any ){
    // Esta linea es para borrar el nombre cuando se carga una imagen y se cierra el inputFile sin haberla guardado
    this.valorInputFile = inputFile;
    this.imagenTemporal = '';
    this.modalImagenService.cerrarModal();
  }

  cargarImagen(event: any) {
    this.imagenSubir = event.target.files[0];
    if ( !event.target.files[0] ) {
      this.imagenTemporal = '';
      return;
    }
    this.mostrarImagenTemporal(event.target.files[0]);
  }

  subirImagen() {
    const tipo = this.modalImagenService.tipo;
    const id = this.modalImagenService.id;

    this.fileUploadService.actualizarFoto(this.imagenSubir, tipo, id)
      .subscribe( (img: any) => {
        this.cerrarModal( this.valorInputFile );
        this.modalImagenService.nuevaImagen.emit(img.nombreArchivo);
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
