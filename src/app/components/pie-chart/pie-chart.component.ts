import { Component, OnInit, Input } from '@angular/core';
import { ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {

  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },
    plugins: {
      datalabels: {
        // formatter: (value, ctx) => {
        //   const label = ctx.chart.data.labels[ctx.dataIndex];
        //   return label;
        // },
        labels : {
          title : null
        }
      },
    }
  };
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [pluginDataLabels];
  @Input() pieChartColours : any[]
  @Input() pieChartLabels: Label[]
  @Input() pieChartData: number[]
  constructor(
    private data : DataService
  ) { }

  ngOnInit(): void {
  }

}
