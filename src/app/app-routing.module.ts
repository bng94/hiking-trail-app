import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'recommendation',
    loadChildren: () => import('./recommendation/recommendation.module').then( m => m.RecommendationPageModule)
  },
  {
    path: 'hikerinfos',
    loadChildren: () => import('./hikerinfos/hikerinfos.module').then( m => m.HikerinfosPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, useHash: true }, )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
