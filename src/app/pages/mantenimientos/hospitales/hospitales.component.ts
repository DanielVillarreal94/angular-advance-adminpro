import { Component, OnInit } from '@angular/core';
import { HospitalService } from '../../../services/hospital.service';
import { Hospital } from '../../../models/hospital.model';
import Swal from 'sweetalert2';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { delay, Subscription } from 'rxjs';
import { BusquedasService } from '../../../services/busquedas.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit {

  public hospitales: Hospital[] = [];
  public hospitalesPrimeraCarga: Hospital[] = [];
  public cargando: boolean = true;
  public imgSubs?: Subscription;

  constructor(private hospitalService: HospitalService,
              private modalImagenService: ModalImagenService,
              private busquedasService: BusquedasService,
              ) { }

  ngOnInit(): void {
    this.cargarHopitales()

    this.imgSubs = this.modalImagenService.nuevaImagen
        .pipe(
          delay(1000)// tiempo que demora la imagen en actualizarce en la tabla
        )
        .subscribe( resp => this.cargarHopitales());
  }

  cargarHopitales() {
    this.cargando = true;
    this.hospitalService.getHospitales()
      .subscribe(hospitales => {
        this.cargando = false;
        this.hospitales = hospitales;
        this.hospitalesPrimeraCarga = hospitales;
      });

  }

  actualizarHospital(hospital: Hospital) {
    this.hospitalService.actualizarHospital(hospital._id, hospital.nombre)
      .subscribe(resp => {
        Swal.fire('Actualizado', `El nombre se ha modificado a: ${hospital.nombre}`, 'success');
      });
  }

  borrarHospital(hospital: Hospital) {
    Swal.fire({
      title: '¿Está seguro de eliminar?',
      text: `El hospital '${hospital.nombre}' se va a borrar`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.hospitalService.borrarHospital(hospital._id)
          .subscribe(resp => this.cargarHopitales());
      }
    })

  }

 // Crear hopital desde un swal alert
  async abrirSwalCrearHospital(){
    const { value = '' } = await Swal.fire({
      title: 'Crear Hospital',
      input: 'text',
      inputLabel: 'Nombre del Hospital',
      inputPlaceholder: 'Ingrese el nombre del hospital',
      showCancelButton: true,
      confirmButtonText: 'Crear hopital',
    })

    if( value.trim().length > 0 ){
      this.hospitalService.crearHospital( value )
          .subscribe( (resp:any) => {
            this.hospitales.push( resp.newHospital )
          })
    }
  }

  abrirModal( hospital: Hospital ){
    this.modalImagenService.abrirModal( 'hospitales', hospital._id, hospital.img );
  }

  buscar( termino: string ){
    if ( termino ) {
      this.busquedasService.buscar( 'hospitales', termino )
      .subscribe( (resp: any) => this.hospitales = resp )
    } else {
      this.hospitales = this.hospitalesPrimeraCarga;
    }
  }


}
