import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { tap, map, catchError, of, Observable } from 'rxjs';
import { Router } from '@angular/router';

import { RegisterForm } from '../interfaces/register-form.interface';
import { environment } from 'src/environments/environment';
import { LoginForm } from '../interfaces/login-form.interface';
import { Usuario } from '../models/usuario.model';

const baseUrl = environment.base_url;
declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  public usuario?: Usuario;

  auth2: any;

  constructor( private http: HttpClient,
               private router: Router,
               private ngZone: NgZone) {
                 this.googleInit();
               }

  get token() {
    return localStorage.getItem('token') || '' ;
  }

  get userId(){
    return this.usuario?.uid || '';
  }

  googleInit() {
    return new Promise( (resolve: any) => {
      gapi.load('auth2', () => {
            this.auth2 = gapi.auth2.init({
              client_id: '522636691267-ephgduick0aum7ktrl3h7upocdr72j79.apps.googleusercontent.com',
              cookiepolicy: 'single_host_origin'
            });
            resolve();
          });
    })

  }

  logout(){
    localStorage.removeItem('token');

    this.auth2.signOut().then( () => {
      this.ngZone.run( () => {
        this.router.navigateByUrl('/login');
      })
    });
  }

  validarToken(): Observable<boolean>{
    const token = this.token;
    return this.http.get(`${ baseUrl }/login/renew`, {
      headers: {
        'x-token': token
      }
    }).pipe(
      map( (resp: any) =>{

        const {nombre, email, role, google, img, uid} = resp.usuario;
        this.usuario = new Usuario(nombre, email, role, google, img, uid);
        localStorage.setItem('token', resp.token);
        return true;
      }),
      catchError( error => of( false ))
    )
  }

  crearUsuario( formData: RegisterForm ) {
    return this.http.post(`${ baseUrl }/usuarios`, formData)
            .pipe(
              tap( (resp: any) => {
                localStorage.setItem('token', resp.token);
              })
            );
  }

  actualizarPerfil( data: {nombre: string, email: string, role:any}){
    data = {
      ...data,
      role: this.usuario?.role
    };
    return this.http.put(`${ baseUrl }/usuarios/${ this.userId}`, data,{
      headers:{
        'x-token': this.token
      }
    })
  }

  login( formData: LoginForm ) {
    return this.http.post(`${ baseUrl }/login`, formData)
            .pipe(
              tap( (resp: any) => {
                localStorage.setItem('token', resp.token);
              })
            );
  }

  loginGoogle( token:any ) {
    return this.http.post(`${ baseUrl }/login/google`, { token }) //El token hay que enviarlo como objeto
            .pipe(
              tap( (resp: any) => {
                localStorage.setItem('token', resp.token);
              })
            );
  }
}
