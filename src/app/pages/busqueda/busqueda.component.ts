import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BusquedasService } from '../../services/busquedas.service';
import { Usuario } from '../../models/usuario.model';
import { Medico } from '../../models/medico.model';
import { Hospital } from '../../models/hospital.model';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: [
  ]
})
export class BusquedaComponent implements OnInit {

  public usuarios: Usuario[] = [];
  public medicos: Medico[] = [];
  public hospitales: Hospital[] = [];

  constructor( private activatedRoute: ActivatedRoute,
               private busquedasService: BusquedasService,
               private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe( ({ termino }) => this.busquedaGlobal(termino) );
  }

  busquedaGlobal( termino: string){
    this.busquedasService.busquedaGlobal( termino )
        .subscribe( (resp: any) => {
          if( !resp ) return;
          console.log(resp);

          this.usuarios = resp.searchUser;
          this.medicos = resp.searchDoctor;
          this.hospitales = resp.searchHospital;
        });

  }

  redireccionMedicos( medico: Medico ){
    this.router.navigateByUrl(`/dashboard/medico/${ medico._id }`);
  }
}
