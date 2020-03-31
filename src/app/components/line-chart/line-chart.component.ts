import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ChartDataSets, ChartOptions, Chart } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';


@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {
  // public lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  @Input() lineChartLabels: Label[]
  @Input() lineChartData : any[] = []
  // [
  //   { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
  // ];
  public lineChartOptions = {
    responsive: true,
    plugins : {
      dataLabels : {
        labels : {
          title : null
        }
      }
    }
  };
  @Input() lineChartColors: Color[] 
  // = [
  //   {
  //     borderColor: 'black',
  //     backgroundColor: 'rgba(0,0,0,0.2)',
  //     pointBackgroundColor : 'black',
  //     pointRadius : 5
  //   },
  // ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [pluginDataLabels];


  constructor() { }

  ngOnInit(): void {
    this.createChartData()
  }

  createChartData() {
    // this.lineChart = []
  }
}
