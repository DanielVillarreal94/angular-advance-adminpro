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
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PagesRoutingModule { }
