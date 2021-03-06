import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard } from '../guards/auth.guard';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { PerfilComponent } from './perfil/perfil.component';
import { UsuariosComponent } from './mantenimientos/usuarios/usuarios.component';
import { HospitalesComponent } from './mantenimientos/hospitales/hospitales.component';
import { MedicosComponent } from './mantenimientos/medicos/medicos.component';
import { MedicoComponent } from './mantenimientos/medicos/medico.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { AdminGuard } from '../guards/admin.guard';

const routes: Routes = [
  {
    path: 'dashboard',
    canActivate: [ AuthGuard ],
    component: PagesComponent,
    children: [
      { path: '', component: DashboardComponent, data: { titleParameter: 'Dashboard' }},
      { path: 'progress', component: ProgressComponent, data: { titleParameter: 'Progress' } },
      { path: 'grafica1', component: Grafica1Component, data: { titleParameter: 'Grafica #1' } },
      { path: 'account-settings', component: AccountSettingsComponent, data: { titleParameter: 'Temas' } },
      { path: 'promesas', component: PromesasComponent, data: { titleParameter: 'Promesas' } },
      { path: 'rxjs', component: RxjsComponent, data: { titleParameter: 'RxJs' } },
      { path: 'perfil', component: PerfilComponent, data: { titleParameter: 'Perfil' } },
      { path: 'buscar/:termino', component: BusquedaComponent, data: { titleParameter: 'Busqueda general' } },

      // Mantenimientos
      { path: 'hospitales', component: HospitalesComponent, data: { titleParameter: 'Hospitales de la aplicaci??n' }},
      { path: 'medicos', component: MedicosComponent, data: { titleParameter: 'M??dicos de la aplicaci??n' }},
      { path: 'medico/:id', component: MedicoComponent, data: { titleParameter: 'M??dico de la aplicaci??n' }},

      // urls del Admin
      { path: 'usuarios',canActivate:[AdminGuard], component: UsuariosComponent, data: { titleParameter: 'Usuarios de la aplicaci??n' }},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PagesRoutingModule { }
