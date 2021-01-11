import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, switchMap, tap, finalize } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { BookService, CategoryService } from './../../services/index';
import { Book } from './../../models/index';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {
  dialogTitle: string;
  bookFormGroup: FormGroup;
  filteredCategories: any[];
  isLoading = false;

  currentBook: Book;

  status: any[] = [
    { value: false, viewValue: 'Unavailable' },
    { value: true, viewValue: 'Available' },
  ];

  constructor(private _formBuilder: FormBuilder,
    private BookService: BookService,
    private CategoryService: CategoryService,
    private route: ActivatedRoute,
    public matDialogRef: MatDialogRef<BookDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.dialogTitle = 'Update Book',

      this.bookFormGroup = this._formBuilder.group({
        cover: [''],
        name: ['', [Validators.required]],
        author: ['', [Validators.required]],
        category: ['', [Validators.required]],
        publication: ['', [Validators.required]],
        status: ['', [Validators.required]],
        borrow_user: [''],
      })

    this.bookFormGroup
      .get('category')
      .valueChanges
      .pipe(
        debounceTime(300),
        tap(() => this.isLoading = true),
        switchMap(value => this.CategoryService.getAll()
          .pipe(
            finalize(() => this.isLoading = false)
          )
        )
      )
      .subscribe(results => this.filteredCategories = results);

    this.BookService.getById(this.data.bookId)
      .pipe()
      .subscribe(response => {
        this.currentBook = response;

        this.bookFormGroup.patchValue({
          cover: this.currentBook.cover,
          name: this.currentBook.name,
          author: this.currentBook.author,
          category: this.currentBook.category,
          publication: this.currentBook.publication,
          status: this.currentBook.status,
          borrow_user: this.currentBook.borrow_user
        })
      })
  }

  displayFn(book: Book) {
    if (book) { return book.name; }
  }

  onCoverImgChange($event) {
    var file: File = $event.target.files[0];
    var self = this;
    var myReader: FileReader = new FileReader();
    myReader.onloadend = function (loadEvent: any) {
      self.bookFormGroup.patchValue({ cover: myReader.result })
    };
    myReader.readAsDataURL(file);
  }

  updateBook() {
    var book = {
      id: this.currentBook.id,
      cover: this.bookFormGroup.value.cover,
      name: this.bookFormGroup.value.name,
      author: this.bookFormGroup.value.author,
      categories_id: this.bookFormGroup.value.category.id,
      publication: this.bookFormGroup.value.publication,
      status: this.bookFormGroup.value.status,
      borrow_user: this.bookFormGroup.value.borrow_user
    };

    this.BookService.update(book.id, book)
      .pipe()
      .subscribe(result => {
        this.matDialogRef.close();
      })
  }
}
