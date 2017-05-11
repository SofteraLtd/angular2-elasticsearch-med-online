
import { Injectable } from '@angular/core';

import { Client, SearchResponse } from 'elasticsearch';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';;
import 'rxjs/add/operator/distinct';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/fromPromise';


@Injectable()
export class ElasticsearchService {

    private _esClient: Client;

    constructor() {
        this._esClient = new Client({
            host: 'http://localhost:9200',
            log: 'error'
        });
    }

    getProducts(query: string): Observable<Object[]> {
        return Observable.fromPromise( 
            <Promise<any>> this._esClient.search({
                index: 'products',
                type: 'product',
                body: {
                    query: {
                        match: {
                            _all: query
                        }
                    }
                }
            })
        )
        .map((response: SearchResponse<string>) => response.hits.hits)
        .do(data => console.log('Retrieved: ' +  JSON.stringify(data)))
        .catch(this.handleError);
    }

    doFuzzySearch(query: string): Observable<Object[]> {
        return Observable.fromPromise( 
            <Promise<any>> this._esClient.search({
                index: 'products',
                type: 'product',
                body: {
                    query: {
                        multi_match: {
                            fields : ['name', 'descr', 'category'],
                            query: query,
                            fuzziness : 'AUTO'
                        }
                    }
                }
            })
        )
        .map((response: SearchResponse<string>) => response.hits.hits)
        .do(data => console.log('Retrieved: ' +  JSON.stringify(data)))
        .catch(this.handleError);
    }

    getSuggestions(value: string): Observable<any> {
        return Observable.fromPromise( 
            <Promise<any>> this._esClient.suggest({
                index: 'keywords',
                body: {
				    searchSuggester : {
				        text : value,
				        completion : {
				            field : 'prod_suggest'
				        }
				    }
                }
            })
        )
        .map((response: any) => response.searchSuggester[0].options)
        .map(docs => this.extract(docs))
        .do(data => console.log('Suggests: ' +  JSON.stringify(data)))
        .catch(this.handleError);
    }

    private handleError(error: any) {
        console.error(error);
        return Observable.throw(error.json() || 'Server error');
    }

    private extract(docs: any[]): string[] {
        let texts: string[] = new Array();
        docs.forEach( doc => (texts.indexOf(doc.text) === -1 ? texts.push(doc.text) : ''/*ignore*/));
        return texts;
    }
}
