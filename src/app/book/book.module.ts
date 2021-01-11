import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from './../angular-material-elements/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BookListComponent } from './book-list/book-list.component';
import { BookDetailComponent } from './book-detail/book-detail.component';
import { BookCreateComponent } from './book-create/book-create.component';

const routes: Routes = [
  {
    path: 'book/book-list',
    component: BookListComponent
  },
  {
    path: 'book/book-detail',
    component: BookDetailComponent
  },
  {
    path: 'book/book-create',
    component: BookCreateComponent
  }
]

@NgModule({
  declarations: [BookListComponent, BookDetailComponent, BookCreateComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],   
  providers: []
})
export class BookModule { }
 