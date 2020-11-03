import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecommendationPageRoutingModule } from './recommendation-routing.module';

import { RecommendationPage } from './recommendation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecommendationPageRoutingModule
  ],
  declarations: [RecommendationPage]
})
export class RecommendationPageModule {}
