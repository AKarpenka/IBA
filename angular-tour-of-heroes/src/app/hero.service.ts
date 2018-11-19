import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Hero } from './hero';
import { MessageService } from './message.service';

import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

const httpOptions = {
  headers: new Headers({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class HeroService {

  heroes: any;
  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private _http: Http) { }


  getHeroes() {
    return this._http.get("/api/heroes")
      .map(heroes => this.heroes = heroes.json().data);
  }

  /** GET hero by id. Return `undefined` when id not found */
  getHeroNo404(id: number) {
    const url = `/api/heroes/?id=${id}`;
    return this._http.get(url)
      .pipe(
        map(heroes => heroes[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} hero id=${id}`);
        }),
        catchError(this.handleError(`getHero id=${id}`))
      );
  }

  /** GET hero by id. Will 404 if id not found */
  getHero(id: number) {
    const url = `/api/heroes/${id}`;
    return this._http.get(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError(`getHero id=${id}`))
    );
  }

  /* GET heroes whose name contains search term */
  searchHeroes(term: string) {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this._http.get(`/api/heroes/?name=${term}`).pipe(
      tap(_ => this.log(`found heroes matching "${term}"`)),
      catchError(this.handleError('searchHeroes', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new hero to the server */
  addHero(hero: any) {
    return this._http.post("/api/heroes", hero, httpOptions).pipe(
      tap((hero: any) => this.log(`added hero w/ id=${hero.id}`)),
      catchError(this.handleError('addHero'))
    );
  }

  /** DELETE: delete the hero from the server */
  deleteHero(hero: any) {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `/api/heroes/${id}`;

    return this._http.delete(url, httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError('deleteHero'))
    );
  }

  /** PUT: update the hero on the server */
  updateHero(hero: any) {
    return this._http.put("/api/heroes", hero, httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any) => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add('HeroService: ' + message);
  }
}
