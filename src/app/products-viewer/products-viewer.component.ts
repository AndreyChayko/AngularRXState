import {
  Component,
  ChangeDetectionStrategy,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ProductsService } from '../../services/products.service';
import {
  BehaviorSubject,
  combineLatest,
  delay,
  distinctUntilChanged,
  map,
  of,
  ReplaySubject,
  shareReplay,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';

@Component({
  selector: 'app-products-viewer',
  templateUrl: './products-viewer.component.html',
  styleUrls: ['./products-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsViewerComponent implements OnDestroy, OnInit {
  destroy$ = new ReplaySubject(1);
  productIndex$ = new BehaviorSubject(0);
  distinctIndex$ = this.productIndex$.pipe(
    distinctUntilChanged(),
    tap(() =>
      console.log(
        '%c productIndex$ calculating...',
        'color: red; padding-left: 20px;'
      )
    )
  );
  products$ = this.productsService.getProducts().pipe(
    takeUntil(this.destroy$),
    tap(() =>
      console.log(
        '%c products$ calculating...',
        'color: red; padding-left: 20px;'
      )
    ),
    shareReplay(1)
  );
  product$ = combineLatest([this.products$, this.distinctIndex$]).pipe(
    tap(() =>
      console.log(
        '%c product$ calculating...',
        'color: red; padding-left: 20px;'
      )
    ),
    map(([products, index]) => products[index])
  );
  hasPrevious$ = this.distinctIndex$.pipe(
    tap(() =>
      console.log(
        '%c hasPrevious$ calculating...',
        'color: red; padding-left: 20px;'
      )
    ),
    map((index) => index > 0),
    shareReplay({
      refCount: true,
      bufferSize: 1,
    })
  );
  hasNext$ = combineLatest([this.products$, this.distinctIndex$]).pipe(
    map(([products, productIndex]) => {
      console.log(
        '%c hasNext$ calculating...',
        'color: red; padding-left: 20px;'
      );
      return productIndex + 1 < products.length;
    }),
    shareReplay({
      refCount: true,
      bufferSize: 1,
    })
  );

  constructor(private productsService: ProductsService) {}

  ngOnInit() {
    this.distinctIndex$
      .pipe(switchMap((index) => of(index).pipe(delay(3000))))
      .subscribe((index) => {
        this.productIndex$.next(this.productIndex$.value + 1);
      });
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  next() {
    this.productIndex$.next(this.productIndex$.value + 1);
  }

  previous() {
    this.productIndex$.next(this.productIndex$.value - 1);
  }

  reset() {
    this.productIndex$.next(0);
  }
}
