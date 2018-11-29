import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrintComponent } from './components/pages/print/print.component';
import { StatusComponent } from './components/pages/status/status.component';
import { SettingsComponent } from './components/pages/settings/settings.component';

const routes: Routes = [
  {
    path: 'home',
    component: StatusComponent,
  },
  {
    path: 'print',
    component: PrintComponent,
  },
  {
    path: 'settings',
    component: SettingsComponent,
  },

  {
    path: '**',
    redirectTo: '/home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
