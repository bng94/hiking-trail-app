import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HikerinfosPage } from './hikerinfos.page';

const routes: Routes = [
  {
    path: '',
    component: HikerinfosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HikerinfosPageRoutingModule {}
