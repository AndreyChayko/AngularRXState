import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import {delay, distinctUntilChanged, Observable, of, switchMap, tap, withLatestFrom} from 'rxjs';
import { Product } from '../../models/product';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import isEqual from 'lodash.isequal';

interface ProductsState {
  products: Product[];
  productIndex: number;
}

@Component({
  selector: 'app-products-viewer-store',
  templateUrl: './products-viewer-store.component.html',
  styleUrls: ['./products-viewer-store.component.scss'],
  providers: [ComponentStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsViewerStoreComponent implements OnInit {
  productIndex$: Observable<number> = this.store.select((state) => {
    console.log(
      '%c productIndex$ calculating...',
      'color: green; padding-left: 60px;'
    );
    return state.productIndex;
  });
  products$: Observable<Product[]> = this.store.select((state) => {
    console.log(
      '%c products$ calculating...',
      'color: green; padding-left: 60px;'
    );
    return state.products;
  }).pipe(distinctUntilChanged(isEqual));
  product$: Observable<Product> | undefined = this.store.select(
    this.products$,
    this.productIndex$,
    (products, index) => {
      console.log(
        '%c product$ calculating...',
        'color: green; padding-left: 60px;'
      );
      return products[index];
    }
  );
  hasPrevious$: Observable<boolean> = this.store.select(
    this.productIndex$,
    (index) => {
      console.log(
        '%c hasPrevious$ calculating...',
        'color: green; padding-left: 60px;'
      );
      return index > 0;
    }
  );
  hasNext$: Observable<boolean> = this.store.select(
    this.products$,
    this.productIndex$,
    (products, index) => {
      console.log(
        '%c hasNext$ calculating...',
        'color: green; padding-left: 60px;'
      );
      return index + 1 < products.length ?? 0;
    }
  );

  constructor(
    private productsService: ProductsService,
    private readonly store: ComponentStore<ProductsState>
  ) {}

  ngOnInit(): void {
    this.store.setState({ productIndex: 0, products: [] });
    this.store.effect(() =>
      this.productsService.getProducts().pipe(
        tapResponse(
          (products) => this.store.patchState({ products }),
          () => console.log('Error')
        )
      )
    );
    this.store.effect(() =>
      this.productIndex$.pipe(
        switchMap((index) => of(index).pipe(delay(3000))),
        withLatestFrom(this.hasNext$),
        tap(([index,hasNext]) =>

              this.store.patchState((state) => ({
                ...state,
                productIndex: hasNext ? state.productIndex + 1 : state.productIndex,
              }))


        )
      )
    );
  }

  next() {
    this.store.patchState((state) => ({
      ...state,
      productIndex: state.productIndex + 1,
    }));
  }

  previous() {
    this.store.patchState((state) => ({
      ...state,
      productIndex: state.productIndex - 1,
    }));
  }

  reset() {
    this.store.patchState({ productIndex: 0 });
  }
}
