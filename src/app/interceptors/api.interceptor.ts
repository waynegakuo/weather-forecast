import { environment } from '../../environments/environment';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

export class APIInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let requestURL = req.url;

    // If we are making a request to the Geocode API, change the prefix to the correct API _
    // Geocoding API URL located in the environment file
    if (requestURL.indexOf('@api-x') !== -1) {
      requestURL = requestURL.replace('@api-x', environment.geoCodeAPI);
      const cloneReq = req.clone({
        url: requestURL, // replace the old URL with the new URL ~ requestURL
        params: req.params.set(
          'apiKey',
          'YOUR_GEOCODE_API_KEY'
        )
      });
      // move to next HttpClient request life cycle
      return next.handle(cloneReq);
    }

    // If we are making a request to the Weather API, change the prefix to the correct API _
    // Weather API URL is located in the environment file
    else if (requestURL.indexOf('@api-y') !== -1) {
      requestURL = requestURL.replace('@api-y', environment.weatherAPI);
      const cloneReq = req.clone({
        url: requestURL, // replace the old URL with the new URL ~ requestURL
        params: req.params.set(
          'appid',
          'YOUR_OPENWEATHER_API_KEY'
        )
      });
      // move to next HttpClient request life cycle
      return next.handle(cloneReq);
    }

  }
}
