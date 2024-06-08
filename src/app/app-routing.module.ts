import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  { path: '', redirectTo: 'anim-splash', pathMatch: 'full'},
  {
    path: 'main',
    loadChildren: () => import('./main/main.module').then(m => m.MainPageModule)
  },
  {
    path: 'puntuacion',
    loadChildren: () => import('./puntuacion/puntuacion.module').then( m => m.PuntuacionPageModule)
  },
  {
    path: 'juego/:dificultad',
    loadChildren: () => import('./juego/juego.module').then( m => m.JuegoPageModule)
  },
  {
    path: 'anim-splash',
    loadChildren: () => import('./anim-splash/anim-splash.module').then( m => m.AnimSplashPageModule)
  },

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
