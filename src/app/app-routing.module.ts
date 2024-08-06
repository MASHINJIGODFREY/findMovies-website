import { NgModule } from '@angular/core';
import { RouterModule, Routes, TitleStrategy } from '@angular/router';
import { AppComponent } from './app.component';
import { PageTitleService } from './services';

const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    loadChildren: () => import('./modules/main/main.module').then(m => m.MainModule)
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{ provide: TitleStrategy, useClass: PageTitleService }]
})
export class AppRoutingModule { }
