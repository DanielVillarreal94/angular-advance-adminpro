import { environment } from "src/environments/environment"
const base_url = environment.base_url;
// const token = localStorage.getItem('token') || '';
export class Usuario {

  constructor(
    public nombre: string,
    public email: string,
    public role?: string,
    public google?: string,
    public img?: string,
    public uid?: string,
  ) {  }

  get traerImagen(){

    if( this.img?.includes('https')){
      return this.img;
    }

    if ( this.img ) {
      return `${ base_url }/upload/usuarios/${ this.img }`;
    } else {
      return `${ base_url }/upload/usuarios/no-image`;
    }

  }


}
