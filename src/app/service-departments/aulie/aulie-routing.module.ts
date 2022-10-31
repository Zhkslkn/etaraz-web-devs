import { AulieAtaComponent } from './aulie-ata/aulie-ata.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from '../../shared/helper/role.guard';

const routes: Routes = [
  {
    path: 'aulie-ata-programm', component: AulieAtaComponent,
    canLoad: [RoleGuard], canActivate: [RoleGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AulieRoutingModule {
}
