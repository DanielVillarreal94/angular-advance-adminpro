import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Medico } from '../models/medico.model';
import { map } from 'rxjs/operators';

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  public url: string = `${ base_url }/medicos`;

  constructor( private http: HttpClient ) { }

  get headers(){
    return {
      headers: {
        'x-token': localStorage.getItem('token') || ''
      }
    }
  }

  getMedicos() {
    return this.http.get<any>( this.url, this.headers )
            .pipe(
              map( (resp: {ok: boolean, medicos: Medico[]}) => resp.medicos )
            )
  }

  getMedico( id:string ) {
    return this.http.get<any>( `${this.url}/${id}`, this.headers )
            .pipe(
              map( (resp: {ok: boolean, medico: Medico}) => resp.medico )
            )
  }

  createMedico( medico: {nombre: string, hospital: string} ){
    return this.http.post( this.url, medico, this.headers )
  }

  updateMedico( medico: Medico ){
    return this.http.put( `${this.url}/${ medico._id }`, medico, this.headers )
  }

  deleteMedico( id: string){
    return this.http.delete( `${this.url}/${ id }`, this.headers );
  }
}
