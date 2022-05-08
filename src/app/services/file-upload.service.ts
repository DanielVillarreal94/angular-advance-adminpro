import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';

const base_url = environment.base_url;
const token = localStorage.getItem('token');

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(private http: HttpClient) { }

  actualizarFoto(archivo: File | any, tipo: 'usuarios' | 'medicos' | 'hopitales', usuarioId: string | any) {

    const url = `${ base_url }/upload/${ tipo }/${ usuarioId }`;
    const formData = new FormData(); // Para crear la data que se va a enviar al backend
    formData.append('archivo', archivo);// Se agreaga la información que va a ir al backend

    return this.http.put(url, formData, {
      headers: {
        'x-token': token || ''
      }
    });
  }
}
