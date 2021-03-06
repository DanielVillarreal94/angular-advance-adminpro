import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { tap, map, catchError, of, Observable } from 'rxjs';
import { Router } from '@angular/router';

import { RegisterForm } from '../interfaces/register-form.interface';
import { environment } from 'src/environments/environment';
import { LoginForm } from '../interfaces/login-form.interface';
import { Usuario } from '../models/usuario.model';
import { CargarUsuarios } from '../interfaces/cargar-usuarios.imterface';

const baseUrl = environment.base_url;
declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  public usuario?: Usuario;

  auth2: any;

  constructor(private http: HttpClient,
    private router: Router,
    private ngZone: NgZone) {
    this.googleInit();
  }

  get token() {
    return localStorage.getItem('token') || '';
  }

  get userId() {
    return this.usuario?.uid || '';
  }

  get role(){
    return this.usuario?.role;
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  googleInit() {
    return new Promise((resolve: any) => {
      gapi.load('auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id: '522636691267-ephgduick0aum7ktrl3h7upocdr72j79.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin'
        });
        resolve();
      });
    })

  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('menu');

    this.auth2.signOut().then(() => {
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      })
    });
  }

  validarToken(): Observable<boolean> {
    const token = this.token;
    return this.http.get(`${baseUrl}/login/renew`, {
      headers: {
        'x-token': token
      }
    }).pipe(
      map((resp: any) => {

        const { nombre, email, role, google, img, uid } = resp.usuario;
        this.usuario = new Usuario(nombre, email, role, google, img, uid);
        localStorage.setItem('token', resp.token);
        localStorage.setItem('menu', JSON.stringify( resp.menu ));

        return true;
      }),
      catchError(error => of(false))
    )
  }

  crearUsuario(formData: RegisterForm) {
    return this.http.post(`${baseUrl}/usuarios`, formData)
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token);
          localStorage.setItem('menu', JSON.stringify( resp.menu ));
        })
      );
  }

  actualizarPerfil(data: { nombre: string, email: string, role: any }) {
    data = {
      ...data,
      role: this.usuario?.role
    };
    return this.http.put(`${baseUrl}/usuarios/${this.userId}`, data, this.headers);
  }

  login(formData: LoginForm) {
    return this.http.post(`${baseUrl}/login`, formData)
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token);
          localStorage.setItem('menu', JSON.stringify( resp.menu ));

        })
      );
  }

  loginGoogle(token: any) {
    return this.http.post(`${baseUrl}/login/google`, { token }) //El token hay que enviarlo como objeto
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token);
          localStorage.setItem('menu', JSON.stringify( resp.menu ));
        })
      );
  }

  cargarUsuarios(desde: number = 0, cantidad: number = 5) {
    const url = `${baseUrl}/usuarios?desde=${desde}&cantidad=${cantidad}`;
    return this.http.get<CargarUsuarios>(url, this.headers)
              .pipe(
                map( resp => {
                  // lista de usuarios en objetos
                  const usuarios = resp.usuarios.map( user => {
                    return new Usuario( user.nombre, user.email, user.role, user.google, user.img, user.uid);
                  })
                  return {
                    total: resp.total,
                    usuarios
                  }
                })
              );
  }

  eliminar( usuario: Usuario ){
    const url = `${baseUrl}/usuarios/${usuario.uid}`;
    return this.http.delete(url, this.headers);
  }

  actualizarUsuario( user: Usuario ){
    return this.http.put(`${baseUrl}/usuarios/${ user.uid }`, user, this.headers);
  }
}
