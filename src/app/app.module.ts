import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import { ChartsModule } from 'ng2-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VisualizeComponent } from './components/visualize/visualize.component';
import { DiscoverComponent } from './components/discover/discover.component';
import { CounterComponent } from './components/counter/counter.component';
import { LineChartComponent } from './components/line-chart/line-chart.component';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    VisualizeComponent,
    DiscoverComponent,
    CounterComponent,
    LineChartComponent,
    PieChartComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
