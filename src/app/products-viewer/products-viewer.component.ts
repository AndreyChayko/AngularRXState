import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {ProductsService} from "../../services/products.service";

@Component({
  selector: 'app-products-viewer',
  templateUrl: './products-viewer.component.html',
  styleUrls: ['./products-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsViewerComponent implements OnInit {

  products$ = this.productsService.getProducts();

  constructor(private productsService: ProductsService) { }

  ngOnInit(): void {
  }

}
