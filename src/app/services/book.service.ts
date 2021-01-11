import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private appEndpoint = environment.appEndpoint;

  constructor(private http: HttpClient) { }

  getAll(currentPage?, pageSize?, search?) {
    let params = '&perPage=' + pageSize;
    if (search) {
      params += '&search=' + search
    }
    return this.http.get<any>(this.appEndpoint + 'book?page=' + currentPage + params, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
      .pipe(
        map(response => {
          return response;
        })
      )
  }

  getById(id: number) {
    return this.http.get<any>(this.appEndpoint + 'book/' + id, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
      .pipe(
        map(response => {
          return response;
        })
      )
  }

  create(book) {
    return this.http.post<any>(this.appEndpoint + 'book', JSON.stringify(book), { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
      .pipe(
        map(response => {
          return response;
        })
      )
  }

  update(id, book) {
    return this.http.put<any>(this.appEndpoint + 'book/' + id, JSON.stringify(book), { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
      .pipe(
        map(response => {
          return response;
        })
      )
  }

  delete(id) {
    return this.http.delete<any>(this.appEndpoint + 'book/' + id, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
      .pipe(
        map(response => {
          return response;
        })
      )
  }
}
