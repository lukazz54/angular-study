import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToolbarModule } from 'primeng/toolbar';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { ToolbarNavigationComponent } from './components/toolbar-navigation/toolbar-navigation.component';
import { ShortenPipe } from './pipes/shorten/shorten.pipe'



@NgModule({
  declarations: [
    ToolbarNavigationComponent,
    ShortenPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    //PrimeNG
    ToolbarModule,
    CardModule,
    ButtonModule
  ],
  //sem essa declaração nao seria possivel usar o componente
  //mesmo se o shared.module fosse importado
  exports: [ToolbarNavigationComponent, ShortenPipe],
  providers: [DialogService, CurrencyPipe]
})
export class SharedModule { }
