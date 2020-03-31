import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as moment from 'moment';
import { DataService } from 'src/app/services/data.service';
import { ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
(window as any).html2canvas = html2canvas;

@Component({
  selector: 'app-visualize',
  templateUrl: './visualize.component.html',
  styleUrls: ['./visualize.component.css']
})
export class VisualizeComponent implements OnInit {
  appTitle = "Visualize"
  to = moment(new Date(Date.now())).format()
  from = moment(new Date(Date.now())).add(-1,'day').format()
  fromLastWeek = moment(new Date(Date.now())).add(-2,'week').format()
  toLastWeek = moment(new Date(Date.now())).add(-1,'week').format()

  //Pie Chart
  public botChartLabels : Label[] = []
  public botChartData : number[] = []
  public botChartColors : any[] = []

  public responseCodeChartLabels : Label[] = []
  public responseCodeChartData : number[] = []
  public responseCodeChartColors : any[] = []
  
  //Line Chart 
  public botLineChartLabels : Label[] = []
  public botLineChartData : any[] = []
  public botLineChartColors : any[] = []

  
  counterTotal : any = 0
  counterBooking : any = 0
  counterSchedule : any = 0
  counterHealth : any = 0
  lastWeekTotal: any = 0;
  lastWeekHealth: any =0;
  lastWeekSchedule: any =0;
  lastWeekBooking: any =0;
 
  selectedInterval : string = "hour"
  live : boolean = false
  liveInterval : any

  constructor(
    private data : DataService
  ) { }

  ngOnInit(): void {
    this.handleGo()
    this.getLastWeekCounts()
    console.log("from",this.from,'\nto',this.to)
    
  }

  changeInterval(interval) {
    this.selectedInterval = interval
    this.handleGo()
  }

  change(key,date) {
    let momentDate = moment(date).format()
    if(key === 'from'){
      this.from = momentDate
    } else {
      this.to = momentDate
    }
    console.log("from",this.from,'\nto',this.to)
    console.log(this.from < this.to)
  }

  toggleLive() {
    this.live = !this.live
    if(this.live){
      this.liveInterval = setInterval(() => {
        console.log("Hit")
        this.to = moment(new Date(Date.now())).format()
        this.from = moment(new Date(Date.now())).add(-1,'day').format()
        this.handleGo()
      },2000)
    } else {
      clearInterval(this.liveInterval)
    }
  }

  handleGo() {
    this.data.getCounter(this.from, this.to, this.selectedInterval).subscribe(res => {
      // console.log(res)
      this.counterTotal = res['hits']['total']['value'];
      var temp = res['aggregations']['healthCount']['buckets'].filter(d => {
        if(d.key === 'healthCheck')
          return d
      })
      console.log(temp)
      this.counterHealth = temp.length!==0 ? temp[0]['doc_count'] : 0

      let flag = false

      res['aggregations']['typeCount']['buckets'].map(bucket => {
        if(bucket['key'] === 'schedule'){
          this.counterSchedule = bucket['doc_count'] 
          flag = true
        }
      })
      this.counterSchedule = flag ? this.counterSchedule : 0;

      flag = false
      res['aggregations']['typeCount']['buckets'].map(bucket => {
        if(bucket['key'] === 'booking'){
          this.counterBooking = bucket['doc_count'] 
          flag = true
        }
      })

      this.counterBooking = flag ? this.counterBooking : 0
      console.log(this.counterTotal, this.counterHealth, this.counterBooking, this.counterSchedule)

      var botData = res['aggregations']['botCount']['buckets']
      this.botChartLabels = botData.map(bot => bot['key'])
      this.botChartData = botData.map(bot => bot['doc_count'])
      this.botChartColors[0]= {
        backgroundColor : this.botChartLabels.map(label => `rgba(${Math.ceil(Math.random()*230)},${Math.ceil(Math.random()*230)},${Math.ceil(Math.random()*230)},${Math.random()*(1-0.7)+0.7})`)
      }

      var responseCodeData = res['aggregations']['responseCodeCount']['buckets']
      this.responseCodeChartLabels = responseCodeData.map(code => code['key'])
      this.responseCodeChartData = responseCodeData.map(code => code['doc_count'])
      this.responseCodeChartColors[0]= {
        backgroundColor : this.responseCodeChartLabels.map(label => `rgba(${Math.ceil(Math.random()*230)},${Math.ceil(Math.random()*230)},${Math.ceil(Math.random()*230)},${Math.random()*(0.6-0.2)+0.2})`)
      }

      var spiderDetailedData = res['aggregations']['dateAggregation']['buckets']
      this.createLineChartData(spiderDetailedData)
    })
  }

  specialElementHandlers = {
    '#editor': function (element, renderer) {
      return true;
    }
  };

  @ViewChild('pdfContent') pdfContent : ElementRef
  @ViewChild('lineChart') lineChart : ElementRef
  handleDownload() {
    let from = new Date(this.from);
    let to  = new Date(this.to);
    let filename = `${from.getDate()}/${from.getMonth()}/${from.getFullYear()} ${from.getHours()}:${from.getMinutes()} -- 
                    ${to.getDate()}/${to.getMonth()}/${to.getFullYear()} ${to.getHours()}:${to.getMinutes()}.pdf`
    html2canvas(this.pdfContent.nativeElement).then((canvas)=> {
      var img = canvas.toDataURL("image/png",1.0);
    
      var imgWidth = 210; 
      var pageHeight = 295;  
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;
      var pdf = new jsPDF('p', 'mm', 'a4');
      var position = 10;

      pdf.addImage(img, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(img, 'PNG', 0, position+10, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(filename);
    })
  }
  
  createLineChartData(values: any) {
    console.log(values)
    if(values.length > 10){
      values = values.slice(0,10)
    }
    values = values.reverse()
    if(this.selectedInterval === 'hour'){
      this.botLineChartLabels = values.map(value => {
        var date = new Date(value['key_as_string'])
        var hours = date.getHours()<10? `0${date.getHours()}` :( date.getHours() >12? date.getHours()-12 : date.getHours())
        var minutes = date.getMinutes()<10? `0${date.getMinutes()}` :date.getMinutes()
        var am = date.getHours()<12 ? true : false
        var returnData = `${hours}:${minutes} ${am? 'AM' : 'PM'}`
        // console.log(returnData)
        return returnData
      })
    } else if ( this.selectedInterval === 'day' ) {
      this.botLineChartLabels = values.map(value => {
        var date = new Date(value['key_as_string'])
        var day = date.getUTCDate()
        var month = ['Jan', 'Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][date.getMonth()]   
        return `${day} ${month}`
      })
    } else {
      this.botLineChartLabels = values.map(value => {
        var date = new Date(value['key_as_string'])
        // console.log(date)
        var month = ['Jan', 'Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][date.getMonth()]
        var year = date.getFullYear()
        return `${month} ${year}`
      })
    }
    this.botLineChartData = this.botChartLabels.map(bot => {
      var data = values.map(value => {
        // var flag = false
        var temp = 0
        value['tags']['buckets'].map(d => {
          if(d.key === bot)
            temp = d['doc_count']
        })
        return temp
      })

      console.log(bot)
      return {
        label : bot,
        data : data
      }
    })
    this.botLineChartColors = this.botChartLabels.map(bot => {
      return {
        borderColor : `rgba(${Math.ceil(Math.random()*255)},${Math.ceil(Math.random()*255)},${Math.ceil(Math.random()*255)},0.7)`,
        backgroudColor : 'rgba(0,0,0,0.8)',
        pointBackgroundColor : 'black',
        pointRadius : 5,
      }
    })
    console.log(this.botLineChartColors)
  }

  getLastWeekCounts() {
    this.data.getCounter(this.fromLastWeek, this.toLastWeek, this.selectedInterval).subscribe(res => {
      console.log(res)
      this.lastWeekTotal = res['hits']['total']['value'];
      var temp = res['aggregations']['healthCount']['buckets'].filter(d => {
        if(d.key === 'healthCheck')
          return d
      })

      this.lastWeekHealth = temp.length!==0 ? temp[0]['doc_count'] : 0

      let flag = false

      res['aggregations']['typeCount']['buckets'].map(bucket => {
        if(bucket['key'] === 'schedule'){
          this.lastWeekSchedule = bucket['doc_count'] 
          flag = true
        }
      })
      this.lastWeekSchedule = flag ? this.lastWeekSchedule : 0;

      flag = false
      res['aggregations']['typeCount']['buckets'].map(bucket => {
        if(bucket['key'] === 'booking'){
          this.lastWeekBooking = bucket['doc_count'] 
          flag = true
        }
      })

      this.lastWeekBooking = flag ? this.lastWeekBooking : 0
      console.log("lastweek",this.lastWeekTotal,this.lastWeekHealth, this.lastWeekBooking, this.lastWeekSchedule);
    })
  }

}
