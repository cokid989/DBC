import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError, retry } from 'rxjs/operators';
import 'rxjs/add/observable/throw';
import { Router } from '@angular/router';
import { API_URL } from './api-url-config';

@Injectable()
export class ApiConnectService {

  constructor(private http: HttpClient, private router: Router) { }

  public login() {
    return this.http
      .get(API_URL + '/login', { responseType: 'text' })
      .pipe(catchError(this.handleError));
  }

  public signUp() {
    return this.http
      .get(API_URL + '/signup')
      .pipe(catchError(this.handleError));
  }

  public logout() {
    return this.http
      .get(API_URL + '/logout')
      .pipe(catchError(this.handleError));
  }

  public test() {
    return this.http
      .get(API_URL + '/testing')
      .pipe(catchError(this.handleError));
  }

}
