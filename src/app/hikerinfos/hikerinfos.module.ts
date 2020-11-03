import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HikerinfosPageRoutingModule } from './hikerinfos-routing.module';

import { HikerinfosPage } from './hikerinfos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HikerinfosPageRoutingModule
  ],
  declarations: [HikerinfosPage]
})
export class HikerinfosPageModule {}
