import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const url_base = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ModalImagenService {

  private _ocultarModal: boolean = true;
  public tipo?: 'usuarios'|'medicos'|'hospitales' | any ;
  public id?: string;
  public img: string = 'no-image';

  public nuevaImagen: EventEmitter<string> = new EventEmitter<string>();


  get ocultarModal(){
    return this._ocultarModal;
  }

  constructor() { }

  abrirModal( tipo: 'usuarios'|'medicos'|'hospitales', id: string, img: string){
    this._ocultarModal = false;
    this.tipo = tipo;
    this.id = id;

    const urlImagen = `${ url_base }/upload/${ tipo }/${ img }`;

    if( !img || !img.includes('https')){
      this.img = urlImagen;
    } else {
      this.img = img;
    }

  }

  cerrarModal(){
    this._ocultarModal = true;
  }


}
