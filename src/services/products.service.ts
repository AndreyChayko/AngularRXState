import {Injectable} from '@angular/core';
import {Product} from "../models/product";
import {delay, Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ProductsService {


  constructor(private http: HttpClient) {

  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>('https://fakestoreapi.com/products');
  }
}

