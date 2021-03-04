import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GeocodeService {

  constructor(private http: HttpClient) { }

  // Request handled by Interceptor where we replace the correct URL and add their respective headers
  // tslint:disable-next-line: typedef
  getCoordinates(city: string) {
    let params = new HttpParams();
    params = params.append('q', city);
    return this.http.get('@api-x', {params}).pipe(catchError(this.errorHandler));
  }

  // tslint:disable-next-line: typedef
  errorHandler(error: HttpErrorResponse) {
    return throwError(error);
  }
}
