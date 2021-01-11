import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { environment } from './../../../environments/environment';
import { Book } from './../../models/index';
import { BookService } from './../../services/book.service';
import { ConfirmDialogComponent } from './../../confirm-dialog/confirm-dialog.component';
import { BookCreateComponent } from './../../book/book-create/book-create.component';
import { BookDetailComponent } from '../book-detail/book-detail.component';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  appEndpoint: string;

  displayedColumns: string[] = ['cover', 'name', 'author', 'category', 'publication', 'status', 'buttons'];
  dataSource: MatTableDataSource<any>;
  pageSize: number = 10;
  lengthBook: number;
  currentPage: number = 1;

  books: Book[];

  dialogRef: any;
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;

  constructor(private BookService: BookService,
    public _matDialog: MatDialog,
    private router: Router,) { }

  ngOnInit(): void {
    this.appEndpoint = environment.appEndpoint;
    this.getAllBooks(this.currentPage)
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  changePage(event) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getAllBooks(this.currentPage + 1)
    this.BookService.getAll(this.currentPage + 1, this.pageSize)
      .pipe()
      .subscribe(
        response => {
          this.books = response.data;
          this.lengthBook = response.total
          this.pageSize = response.per_page;
          this.dataSource = new MatTableDataSource<any>(this.books);
        }, errormessage => {

        }
      )
  }

  getAllBooks(currentPage) {
    this.dataSource = new MatTableDataSource<any>(this.books);
    this.BookService.getAll(currentPage, this.pageSize)
      .pipe()
      .subscribe(
        response => {
          this.books = response.data;
          this.lengthBook = response.total
          this.pageSize = response.per_page;
          this.dataSource = new MatTableDataSource<any>(this.books);
        }, errormessage => {

        }
      )
  }

  newBook(): void {
    this.dialogRef = this._matDialog.open(BookCreateComponent, {
      panelClass: 'book-form-dialog',     
    });

    this.dialogRef.afterClosed()
      .subscribe((response) => {
        this.getAllBooks(this.currentPage);
      });
  }

  updateBook(book) {
    this.dialogRef = this._matDialog.open(BookDetailComponent, {
      panelClass: 'book-form-dialog',
      data: {
        bookId: book.id
      }
    });

    this.dialogRef.afterClosed()
      .subscribe((response) => {
        this.getAllBooks(this.currentPage);
      });    
  }

  deleteBook(id): void {
    this.confirmDialogRef = this._matDialog.open(ConfirmDialogComponent, {
      disableClose: false,
      panelClass: "rd-confirm-dialog"
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.BookService.delete(id)
          .pipe()
          .subscribe(response => {
            this.getAllBooks(this.currentPage);
          })
      }
      this.confirmDialogRef = null;
    });
  }

}
