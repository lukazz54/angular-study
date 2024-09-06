import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private apikey = '8d108cf8e97eebb0a7f2b5f84b53c21a';
  constructor(private http: HttpClient) { }

  getWeatherDatas(cityName:string): Observable<any> {
    return this.http.get(`
      https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&mode=json&appid=${this.apikey}`,{}
    )
  }
}
