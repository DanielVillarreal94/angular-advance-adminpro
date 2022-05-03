import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { UsuarioService } from '../../services/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  public formSunbmitted = false;
  public registerForm = this.fb.group({
    nombre: ['JUANITO PRUEBA', Validators.required],
    email: ['prueba@gmail.com', [ Validators.required, Validators.email ]],
    password: ['123456', Validators.required],
    password2: ['123456', Validators.required],
    terminos: [false, Validators.requiredTrue],
  },{
    validators: this.passwordsIguales('password', 'password2')
  });

  constructor( private fb: FormBuilder,
               private usuarioService: UsuarioService,
               private router: Router) { }

  crearUsuario() {
    this.formSunbmitted = true;
    // console.log(this.registerForm.invalid);
    if (this.registerForm.invalid){
      return;
    }

    //Realizar el posteo al servicio para Crear Usuario
    this.usuarioService.crearUsuario( this.registerForm.value )
         .subscribe( response =>{
           // Navergar al dashboard
            this.router.navigateByUrl('/');
         }, ( err ) => {
          // console.warn( err.error.msg );
          Swal.fire('Error', err.error.msg);
         });
  }

  validarCampos( campo: string ) {
    return this.registerForm.get( campo )?.invalid && this.formSunbmitted
  }

  aceptarTerminos() {
    return !this.registerForm.get( 'terminos' )?.value && this.formSunbmitted;
  }

  contrasenasNoValidas() {
    const pass1 = this.registerForm.get( 'password' )?.value;
    const pass2 = this.registerForm.get( 'password2' )?.value;
    return (pass1 !== pass2) && this.formSunbmitted;

  }

  passwordsIguales( pass1: string, pass2: string){
    return ( formGroup: FormGroup ) => {
      const pass1Controll = formGroup.get( pass1 );
      const pass2Controll = formGroup.get( pass2 );
      if ( pass1Controll?.value === pass2Controll?.value ) {
        pass2Controll?.setErrors(null);
      }else{
        pass2Controll?.setErrors( { noEsIgual: true } );
      }
    }
  }
}
