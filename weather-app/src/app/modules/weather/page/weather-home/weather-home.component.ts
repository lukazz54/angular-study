import { Component, OnDestroy, OnInit } from '@angular/core';
import { WeatherService } from '../../services/weather.service';
import { WeatherDatas } from 'src/app/models/interfaces/weatherDatas';
import { Subject, takeUntil } from 'rxjs';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-weather-home',
  templateUrl: './weather-home.component.html',
  styleUrls: []
})
export class WeatherHomeComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  initialCityName = 'São Paulo';
  weatherDatas!: WeatherDatas;
  searchIcon = faMagnifyingGlass

  constructor(private weatherService: WeatherService){}


  ngOnInit(): void {
    this.getWeatherDatas(this.initialCityName)
  }


  // && <- validação caso o Objeto esteja defined, tenha dados, faz algo
  //takeUntil para assinar o destroy, para quando sair da tela, esse subscribe ser apagado
  //onDestroy, ciclo de vida responsavel por destruir a escuta de um observable quando a navegação sai da pagina do componente
  getWeatherDatas(cityName: string):void {
    this.weatherService.getWeatherDatas(cityName)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        response && (this.weatherDatas = response);
        console.log(response)
      },
      error: (error) => console.log(error)
    });
  }

  onSubmit():void {
    this.getWeatherDatas(this.initialCityName);
    this.initialCityName = '';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
