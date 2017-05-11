import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent }  from './app.component';
import { ProductListComponent }  from './products/product-list.component'; 
import { ProductSearchComponent }  from './products/product-search.component';
import { ElasticsearchService } from './core/elasticsearch.service';

@NgModule({
  imports:      [ BrowserModule,
                  FormsModule,
                  HttpModule,
                  RouterModule.forRoot([
                    { path: 'search', component: ProductSearchComponent },
                    { path: '', redirectTo: 'search', pathMatch: 'full' }, //default
                    { path: '**', redirectTo: 'search', pathMatch: 'full' } // catch all usually should be on a 404 err pg
                  ]),
                  NgbModule.forRoot() ],
  declarations: [ AppComponent,
                  ProductListComponent,
                  ProductSearchComponent ],
  providers: [ ElasticsearchService ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
