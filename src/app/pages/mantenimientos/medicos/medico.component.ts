import { Component, OnInit, Pipe } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from '../../../models/medico.model';

import { HospitalService } from '../../../services/hospital.service';
import { MedicoService } from '../../../services/medico.service';
import { delay } from 'rxjs';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit {

  public medicoForm: FormGroup = this.fb.group({});
  public hospitales: Hospital[] = [];
  public imagenHospitalSelect: string = '' ;
  public nombreHospitalSelect: string = '';

  public medicoSeleccionado?: Medico;

  constructor( private fb: FormBuilder,
               private hospitalService: HospitalService,
               private medicoService: MedicoService,
               private router: Router,
               private activatedRoute: ActivatedRoute ) {
               }

  ngOnInit(): void {

    this.cargarHospitales();

    this.activatedRoute.params.subscribe( ({ id }) => this.CargarMedicoById(id) );
    this.medicoForm = this.fb.group(
      {
        nombre: ['', Validators.required],
        hospital: ['', Validators.required],
      }
    );

  }

  cargarHospitales(){
    this.hospitalService.getHospitales()
      .subscribe( resp => this.hospitales = resp)
  }

  cambiarImagen(){
    this.hospitales.map( resp => {
      if( this.medicoForm.value.hospital === resp._id ){
        this.imagenHospitalSelect = resp.img;
        this.nombreHospitalSelect = resp.nombre;
      }
    });
  }

  almacenar(){

    if ( this.medicoSeleccionado ) {
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id
      }
      this.medicoService.updateMedico( data ).subscribe( (resp:any) => {
        Swal.fire('Actualizado', `El medico ${resp.medico.nombre} se ha actulizado`, 'success');
      })
    } else {
      this.medicoService.createMedico( this.medicoForm.value )
      .subscribe( (resp:any) => {
        Swal.fire('Creado', `El medico ${resp.medico.nombre} se ha creado`, 'success');
        this.router.navigateByUrl(`/dashboard/medico/${resp.medico._id}`);
      })
    }
  }

  CargarMedicoById( id:string ){
    if ( id === 'nuevo') {
      return;
    }

    this.medicoService.getMedico(id)
      .pipe(delay(100))
      .subscribe(medico => {
        if ( !medico ) {
          this.router.navigateByUrl('/dashboard/medicos');
          return;
        }
        const { nombre, hospital, img} = medico;
        this.medicoSeleccionado = medico;
        this.medicoForm.setValue({ nombre, hospital: hospital?._id })
        this.cambiarImagen();
      })
  }
}
