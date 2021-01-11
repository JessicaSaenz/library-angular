import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private appEndpoint = environment.appEndpoint;

  constructor(private http: HttpClient) { }

  getAll() {    
    return this.http.get<any>(this.appEndpoint + 'category', { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) })
      .pipe(
        map(response => {
          return response;
        })
      )
  }
}
