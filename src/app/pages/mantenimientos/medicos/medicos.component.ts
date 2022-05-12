import { Component, OnInit } from '@angular/core';
import { MedicoService } from '../../../services/medico.service';
import { Medico } from '../../../models/medico.model';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { Subscription, delay } from 'rxjs';
import { BusquedasService } from '../../../services/busquedas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit {

  public cargando: boolean = true;
  public medicos: Medico[] = [];
  public medicosPrimeraCarga: Medico[] = [];

  private imgSubcription?: Subscription;

  constructor( private medicoService: MedicoService,
                private modalImagenService: ModalImagenService,
                private busquedasService: BusquedasService) { }

  ngOnInit(): void {
    this.cargarMedicos();

    this.imgSubcription = this.modalImagenService.nuevaImagen
                          .pipe(
                            delay(1000)
                          )
                          .subscribe(resp => this.cargarMedicos());
  }

  cargarMedicos(){
    this.cargando = true;
    this.medicoService.getMedicos()
        .subscribe( resp => {
          this.medicos = resp;
          this.medicosPrimeraCarga = resp;
          this.cargando = false;
        });
  }

  abrirModal( medico: Medico ){
    this.modalImagenService.abrirModal( 'medicos', medico._id, medico.img);
  }

  buscar( termino: string ){

    if ( termino ) {
      this.busquedasService.buscar('medicos', termino)
          .subscribe( (resp: any) => this.medicos = resp )
    } else {
      this.medicos = this.medicosPrimeraCarga;
    }

  }

   borrar( medico: Medico ) {
    Swal.fire({
      title: '¿Borrar médico?',
      text: `El medico '${medico.nombre}' se va a borrar`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicoService.deleteMedico(medico._id)
          .subscribe(resp => {
            this.cargarMedicos()
            Swal.fire('Medico borrado', `${ medico.nombre} fue eliminado correctamente`, 'success')
          });
      }
    })

  }

}
