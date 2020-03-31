import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.css']
})
export class DiscoverComponent implements OnInit {
  appTitle = "Discover"
  to = moment(new Date(Date.now())).format()
  from = moment(new Date(Date.now())).add(-1,'day').format()
  logs : any = []
  searchText : any = ""
  searchLogs : any = []
  pageNumber = 1
  totalPages : any = 0

  constructor(
    private data : DataService
  ) { }

  ngOnInit(): void {
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

  searchTextChange(value) {
    return this.searchText = value;
  }

  handlePageChange(direction){
    if(direction==='prev' && this.pageNumber!==1)
      this.pageNumber--
    else if( direction==='next' && this.pageNumber!==this.totalPages)
      this.pageNumber++
    this.handleGo()
  }

  handleGo() {
    this.data.getDiscoverLogs(this.from, this.to, this.pageNumber).subscribe(d => {
      this.totalPages = Math.ceil(d['hits']['total']['value']/10)
      console.log("total",d['hits']['total']['value'])
      this.logs = d['hits']['hits'].map(value => {
        // console.log(value)
        let log = value['_source']
        let date = new Date(log.timestamp) 
        // console.log(log.timestamp,date)
        let returnData = {
          datetime : `${date.getDate()<10?`0${date.getDate()}`:date.getDate()}-${date.getMonth()<10?`0${date.getMonth()}`:date.getMonth()}-${date.getFullYear()} | ${date.getHours()>12?date.getHours()-12:date.getHours()}:${date.getMinutes()} ${date.getHours()>12 ? 'PM' : 'AM'}`,
          client : log.clientip,
          code : log.status,
          responseTime : log.responseTime ,
          url : log.flight ? `${log.isArabic?'/ar/':'/'}${log.flight}-${log.type}/${log.airlineInfo}.html` : `/${log.airlineInfo}.html`
        }
        // console.log(returnData)
        return returnData
      })
    });
  }

  handleSearch() {
    this.data.getSearchLogs(this.searchText).subscribe(l => {
      let temp = l['hits']['hits']
      this.searchLogs = temp.map(a => {
        let log = a['_source']
        let date = new Date(log['timestamp']) 
        let returnData ={
          datetime : `${date.getDate()<10?`0${date.getDate()}`:date.getDate()}-${date.getMonth()<10?`0${date.getMonth()}`:date.getMonth()}-${date.getFullYear()} | ${date.getHours()>12?date.getHours()-12:date.getHours()}:${date.getMinutes()} ${date.getHours()>12 ? 'PM' : 'AM'}`,
          client : log.clientip,
          agent : log.osInfo ? log.osInfo :`${log.clientOs} (compatible; ${log.spiderBot}/${log.spiderBotVersion})`,
          method : log.action,
          url : log.flight ? `${log.isArabic?'/ar/':'/'}${log.flight}-${log.type}/${log.airlineInfo}.html` : `/${log.airlineInfo}.html`,
          code : log.status,
        }
        return returnData
      })
    })
  }

}
