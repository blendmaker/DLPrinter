import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrintComponent } from './components/pages/print/print.component';
import { FilesComponent } from './components/pages/files/files.component';
import { SettingsComponent } from './components/pages/settings/settings.component';

const routes: Routes = [
  {
    path: 'home',
    component: FilesComponent,
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
