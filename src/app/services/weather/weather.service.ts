import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  units = 'metric';

  constructor(private http: HttpClient) { }

  // Request handled by Interceptor where we replace the correct URL and add their respective headers
  // tslint:disable-next-line: typedef
  getWeatherForecast(lat, long) {
    let params = new HttpParams();
    params = params.append('lat', lat);
    params = params.append('lon', long);
    params = params.append('units', this.units);
    return this.http.get('@api-y', { params }).pipe(catchError(this.errorHandler));
  }

  // tslint:disable-next-line: typedef
  errorHandler(error: HttpErrorResponse) {
    return throwError(error);
  }
}
