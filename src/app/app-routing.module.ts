import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { WellcomeComponent } from './wellcome/wellcome.component';

const routes: Routes = [
  { path: '', component: WellcomeComponent, pathMatch: 'full' },
  {
    path: 'training',
    loadChildren: () =>
      import('./training/training.module').then(
        (module) => module.TrainingModule
      ),
    canLoad: [AuthGuard],
  },
  {
    path: 'articles',
    loadChildren: () =>
      import('./article/article.module').then((module) => module.ArticleModule),
    canLoad: [AuthGuard],
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
