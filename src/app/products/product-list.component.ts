import { Component, Input }  from '@angular/core';

// import { IProduct } from './product';

@Component({
    selector: 'products-list',
    templateUrl: 'app/products/product-list.component.html',
    styleUrls: ['app/products/product-list.component.css']
})
export class ProductListComponent {

    @Input() products: any[];
}