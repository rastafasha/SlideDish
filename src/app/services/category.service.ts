import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private http = inject(HttpClient);
  private url: string = 'json/categories.json';

  getCategories() {
    return this.http.get<Category[]>(this.url);
  }

}
