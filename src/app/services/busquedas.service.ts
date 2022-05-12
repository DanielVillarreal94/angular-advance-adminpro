import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { map, mapTo } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { Hospital } from '../models/hospital.model';
import { Medico } from '../models/medico.model';

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

// lista en ob jetos de usuarios
  private getListaInObject(data: any[]): Usuario[] {
    return data.map(
      user => new Usuario( user.nombre, user.email, user.role, user.google, user.img, user.uid)
    );
  }

  // lista en objetos de hospitales
  private getListInObjectHospitales(data: any[]): Hospital[]{
   return data.map(
    hospital => new Hospital( hospital.nombre, hospital._id, hospital.img)
   );
  }

  private getListMedicos( data: any[]): Medico[]{
    return data;
  }

  buscar(tipo: 'usuarios' | 'hospitales' | 'medicos', termino: string) {
    const url = `${url_base}/busquedas/coleccion/${tipo}/${termino}`;
    return this.http.get(url, this.headers)
      .pipe(
        map((resp: any) => {
          switch (tipo) {
            case 'usuarios':
              return this.getListaInObject(resp.resultado);
            case 'hospitales':
              return this.getListInObjectHospitales(resp.resultado);
            case 'medicos':
              return this.getListMedicos(resp.resultado);
            default:
              return [];
          }
        })
      );
  }


}
