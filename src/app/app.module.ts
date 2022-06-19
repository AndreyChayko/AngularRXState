import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProductsViewerComponent } from './products-viewer/products-viewer.component';
import { HttpClientModule } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ProductsViewerStateComponent } from './products-viewer-state/products-viewer-state.component';
import { ProductsViewerStoreComponent } from './products-viewer-store/products-viewer-store.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductsViewerComponent,
    ProductsViewerStateComponent,
    ProductsViewerStoreComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
