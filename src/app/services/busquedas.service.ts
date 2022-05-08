import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { map, mapTo } from 'rxjs';
import { Usuario } from '../models/usuario.model';

const url_base = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

  constructor(private http: HttpClient) { }

  get headers() {
    return {
      headers: {
        'x-token': localStorage.getItem('token') || ''
      }
    }
  }

  private getListaInObject(data: any[]): Usuario[] {
    return data.map(
      user => new Usuario( user.nombre, user.email, user.role, user.google, user.img, user.uid)
    );
  }

  buscar(tipo: 'usuarios' | 'hospitales' | 'medicos', termino: string) {
    const url = `${url_base}/busquedas/coleccion/${tipo}/${termino}`;
    return this.http.get(url, this.headers)
      .pipe(
        map((resp: any) => {
          switch (tipo) {
            case 'usuarios':
              return this.getListaInObject(resp.resultado);
            default:
              return [];
          }
        })
      );
  }


}
