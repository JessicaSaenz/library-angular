import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'book/book-list',
    pathMatch: 'full'
  },
  {
    path: 'book',
    loadChildren: './book/book.module#BookModule'
  } 
]

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
