import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { DashboardHomeComponent } from './modules/dashboard/page/dashboard-home/dashboard-home.component';
import { AuthGuard } from './guards/auth-guard.service';

//Evitar de colocar todas as rotas em um unico lugar
//pq ao entrar no path home ou '' caso tenha outras rotas os componentes
//em respectivo, tbm serão carregados, aumentando assim o peso de bundle
const routes: Routes = [
  {
    path:'',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    //implementação de lazy load modules
    //carregado apenas quando a url eh chamada no navegador
    path:'dashboard',
    loadChildren: () => import('./modules/dashboard/dashboard.module').then(
      (m) => m.DashboardModule
    ),
    canActivate: [AuthGuard]
  },
  {
    path: 'products',
    loadChildren: () => import('./modules/products/products.module').then(
      (m) => m.ProductsModule
    ),
    canActivate: [AuthGuard]
  },
  {
    path:'categories',
    loadChildren: () => import('./modules/categories/categories.module').then(
      (m) => m.CategoriesModule
    ),
    canActivate: [AuthGuard]
  },
];

//preloadingStrategy => metodo que melhora a performance do site;
//ele basicamente armazena em cache os modulos que nos acessamos
//assim o carregamento da pagina se torna mais rapido
@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules,
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
