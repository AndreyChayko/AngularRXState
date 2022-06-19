import { Component, ChangeDetectionStrategy } from '@angular/core';
import { delay, map, of, switchMap, tap } from 'rxjs';
import { ProductsService } from '../../services/products.service';
import { RxState, select, selectSlice } from '@rx-angular/state';
import { Product } from '../../models/product';

interface ProductsState {
  products: Product[];
  productIndex: number;
}

@Component({
  selector: 'app-products-viewer-state',
  templateUrl: './products-viewer-state.component.html',
  styleUrls: ['./products-viewer-state.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class ProductsViewerStateComponent {
  productIndex$ = this.state
    .select('productIndex')
    .pipe(
      tap(() =>
        console.log(
          '%c productIndex$ calculating...',
          'color: blue; padding-left: 40px;'
        )
      )
    );
  products$ = this.state
    .select('products')
    .pipe(
      tap(() =>
        console.log(
          '%c products$ calculating...',
          'color: blue; padding-left: 40px;'
        )
      )
    );
  product$ = this.state.select(
    selectSlice(['productIndex', 'products']),
    map(({ products, productIndex }) => {
      console.log(
        '%c product$ calculating...',
        'color: blue; padding-left: 40px;'
      );
      return products?.[productIndex];
    })
  );
  hasPrevious$ = this.productIndex$.pipe(
    select(
      map((index) => {
        console.log(
          '%c hasPrevious$ calculating...',
          'color: blue; padding-left: 40px;'
        );
        return index > 0;
      })
    )
  );
  hasNext$ = this.state.select(
    map(({ productIndex, products }) => {
      console.log(
        '%c hasNext$ calculating...',
        'color: blue; padding-left: 40px;'
      );
      return productIndex + 1 < products?.length ?? 0;
    })
  );

  constructor(
    private state: RxState<ProductsState>,
    private productsService: ProductsService
  ) {
    this.state.set({ productIndex: 0 });
    this.state.connect('products', this.productsService.getProducts());
    this.state.connect(
      'productIndex',
      this.productIndex$.pipe(
        switchMap((index) => of(index).pipe(delay(3000)))
      ),
      ({ productIndex }) => productIndex + 1
    );
  }

  next() {
    this.state.set(({ productIndex }) => ({ productIndex: productIndex + 1 }));
  }

  previous() {
    this.state.set(({ productIndex }) => ({ productIndex: productIndex - 1 }));
  }

  reset() {
    this.state.set(({ productIndex }) => ({ productIndex: 0 }));
  }
}
