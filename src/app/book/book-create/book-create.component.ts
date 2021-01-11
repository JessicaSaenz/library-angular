import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { debounceTime, switchMap, tap, finalize } from 'rxjs/operators';

import { BookService, CategoryService } from './../../services/index';
import { Book } from './../../models/index';

@Component({
  selector: 'app-book-create',
  templateUrl: './book-create.component.html',
  styleUrls: ['./book-create.component.css']
})
export class BookCreateComponent implements OnInit {
  dialogTitle: string;
  bookFormGroup: FormGroup;
  filteredCategories: any[];
  isLoading = false;

  status: any[] = [
    { value: false, viewValue: 'Unavailable' },
    { value: true, viewValue: 'Available' },
  ];  

  constructor(private _formBuilder: FormBuilder,
    public matDialogRef: MatDialogRef<BookCreateComponent>,
    private BookService: BookService,
    private CategoryService:CategoryService) { }

  ngOnInit(): void {
    this.dialogTitle = 'New Book',

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

  createBook() {
    var book = {
      cover: this.bookFormGroup.value.cover,
      name: this.bookFormGroup.value.name,
      author: this.bookFormGroup.value.author,
      categories_id : this.bookFormGroup.value.category.id,
      publication: this.bookFormGroup.value.publication,
      status: this.bookFormGroup.value.status,
      borrow_user: this.bookFormGroup.value.borrow_user
    };

    this.BookService.create(book)
      .pipe()
      .subscribe(response => {
        this.matDialogRef.close();
      })
  }

}
