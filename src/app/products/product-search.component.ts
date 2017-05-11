import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';

import { ElasticsearchService } from '../core/elasticsearch.service';
// import { IProduct } from './product';

@Component({
    templateUrl: 'app/products/product-search.component.html',
    styleUrls: ['app/products/product-search.component.css']
})
export class ProductSearchComponent {

    userInput: string;
    result: any[];
    errorMessage: string;
    searching = false;
    searchFailed = false;


    constructor(private _esService: ElasticsearchService) {
    }


    suggest = (text$: Observable<string>) =>
        text$
            .debounceTime(300)
            .distinctUntilChanged()
            .do(() => this.searching = true)
            .switchMap(term =>
                this._esService.getSuggestions(term)
                    .do(() => this.searchFailed = false)
                    .catch(() => {
                        this.searchFailed = true;
                        return Observable.of([]);
                    }))
            .do(() => this.searching = false);

    search(): void {
        this._esService.getProducts(this.userInput)
            .subscribe(products => this.result = <any[]>products,
            error => this.errorMessage = <any>error,
            () => console.log('complete!'));
    }

    fuzzy(): void {
        this._esService.doFuzzySearch(this.userInput)
            .subscribe(products => this.result = <any[]>products,
            error => this.errorMessage = <any>error,
            () => console.log('complete!'));
    }
}