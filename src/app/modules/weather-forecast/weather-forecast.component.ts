import { Component, OnInit, OnDestroy } from '@angular/core';
import { WeatherService } from './../../services/weather/weather.service';
import { GeocodeService } from 'src/app/services/geocode/geocode.service';
import { Subscription } from 'rxjs';
import { FormBuilder, Validators, FormArray, FormGroup, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-weather-forecast',
  templateUrl: './weather-forecast.component.html',
  styleUrls: ['./weather-forecast.component.scss']
})
export class WeatherForecastComponent implements OnInit, OnDestroy {

  weatherData;
  subs: Subscription;
  geoData;
  lat;
  long;
  locationResult = '---';
  weatherDesc = 'clear sky';
  currentTime = new Date();
  imageURL = `http://openweathermap.org/img/wn/01d@2x.png`;
  timezoneOffset;

  // Default weather forecast data (boilerplate)
  weatherForecastData = {
    temperature: 0,
    uvIndex: 0,
    windSpeed: 0,
    feelsLike: 0,
    humidity: 0,
    windDirection: 0,
    pressure: 0,
    currentDate: new Date(),
    sunrise: new Date(),
    sunset: new Date(),
  };

  // Default week forecast data (boilerplate)
  weekForecast = [
    {
      dt: 1613489786,
      temp: {
        max: 30.1,
        min: 23
      },
      weather: [
        {
          icon: '02d'
        }
      ]
    },
    {
      dt: 1613489786,
      temp: {
        max: 30.1,
        min: 23
      },
      weather: [
        {
          icon: '02d'
        }
      ]
    },
    {
      dt: 1613489786,
      temp: {
        max: 30.1,
        min: 23
      },
      weather: [
        {
          icon: '02d'
        }
      ]
    },
    {
      dt: 1613489786,
      temp: {
        max: 30.1,
        min: 23
      },
      weather: [
        {
          icon: '02d'
        }
      ]
    },
    {
      dt: 1613489786,
      temp: {
        max: 30.1,
        min: 23
      },
      weather: [
        {
          icon: '02d'
        }
      ]
    },
    {
      dt: 1613489786,
      temp: {
        max: 30.1,
        min: 23
      },
      weather: [
        {
          icon: '02d'
        }
      ]
    },
    {
      dt: 1613489786,
      temp: {
        max: 30.1,
        min: 23
      },
      weather: [
        {
          icon: '02d'
        }
      ]
    },
  ];

  constructor(private weatherService: WeatherService, private geocodeService: GeocodeService, private fb: FormBuilder) { }

  // Reactive form to handle user input
  locationForm = this.fb.group({
    cityName: ['', Validators.required]
  });

  ngOnInit(): void {
  }

  /**
   * Get Weather Update based on the city
   * @param latitude coordinates provided by the Geolocation function
   * @param longitude coordinates provided by the Geolocation function
   */
  // tslint:disable-next-line: typedef
  getWeatherUpdate(latitude, longitude) {
    this.subs = this.weatherService.getWeatherForecast(latitude, longitude).subscribe(data => {
      this.weatherData = data;

      // Current Weather Data
      const weatherIcon = this.weatherData.current.weather[0].icon;
      this.weatherDesc = this.weatherData.current.weather[0].description;

      this.timezoneOffset = this.weatherData.timezone_offset;

      const currentDate = new Date(this.weatherData.current.dt * 1000); // convert UNIX time provided to readable date
      const sunrise = new Date(this.weatherData.current.sunrise * 1000); // convert UNIX time provided to readable date
      const sunset = new Date(this.weatherData.current.sunset * 1000); // convert UNIX time provided to readable date

      const temperature = this.weatherData.current.temp;
      const uvIndex = this.weatherData.current.uvi;
      const windSpeed = this.weatherData.current.wind_speed;
      const feelsLike = this.weatherData.current.feels_like;
      const humidity = this.weatherData.current.humidity;
      const windDirection = this.weatherData.current.wind_deg;
      const pressure = this.weatherData.current.pressure;

      this.currentTime = new Date(this.weatherData.current.dt * 1000);

      this.weekForecast = this.weatherData.daily; // An array of the weeks forecast data

      // Current weather forecast data
      this.weatherForecastData = {
        temperature, uvIndex, windSpeed, feelsLike,
        humidity, windDirection, pressure, currentDate, sunrise, sunset
      };

      this.imageURL = `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
    });
  }

  /**
   * Get latitude and longitude coordinates based on city name provided by user
   */
  // tslint:disable-next-line: typedef
  getGeolocation() {
    const cityValue = this.locationForm.controls.cityName.value; // Get value from form input
    this.subs = this.geocodeService.getCoordinates(cityValue).subscribe(async data => {
      this.geoData = data;
      this.geoData = this.geoData.items[0];
      this.lat = this.geoData.position.lat;
      this.long = this.geoData.position.lng;
      this.locationResult = this.geoData.title;
      this.getWeatherUpdate(this.lat, this.long); // pass on the lat and long values to the weather update function
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
