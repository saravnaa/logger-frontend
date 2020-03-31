import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private http : HttpClient
  ) { }

  getDiscoverLogs(from, to, pageNumber){
    var headers = new HttpHeaders().set('Content-Type','application/json')
    return this.http.post('/api/getdiscoverlogs',
    {
      from,
      to,
      pageNumber
    },
    {
      headers
    }
    // {
    //   "query" : {
    //     "bool" : {
    //       "filter" : {
    //         "range" : {
    //           "datetime" : {
    //             "gte" : from,
    //             "lte" : to
    //           }
    //         }
    //       }
    //     }
    //   },
    //   "from" : (pageNumber-1)*10,
    //   "size" : 10
    // }
    )
  }

  getSearchLogs(query) {
    return this.http.get("/api/search/"+query);
  }

  getCounter(from, to, interval) {
    return this.http.post("/api/getvisualizelogs",
    {
      from,
      to,
      interval
    }
    // {
    //   "query" : {
    //     "bool": {
    //       "filter": {
    //         "range": {
    //           "timestamp": {
    //             "gte": from,
    //             "lte": to
    //           }
    //         }
    //       }
    //     }
    //   }
    //   ,"aggs": {
    //     "typeCount": {
    //       "terms": {
    //         "field" : "type.keyword"
    //       }
    //     },
    //     "healthCount": {
    //       "terms": {
    //         "field": "airlineInfo.keyword",
    //         "size": 30
    //       }
    //     },
    //     "botCount" : {
    //       "terms" : {
    //         "field" : "spiderBot.keyword"
    //       }
    //     },
    //     "responseCodeCount" : {
    //       "terms" : {
    //         "field" : "status"
    //       }
    //     },
    //     "dateAggregation": {
    //       "date_histogram": {
    //         "field": "timestamp",
    //         "interval": interval,
    //         "order": {
    //           "_key": "desc"
    //         }
    //       },
    //       "aggs": {
    //         "tags": {
    //           "terms": {
    //             "field": "spiderBot.keyword"
    //           }
    //         }
    //       }
    //     }
    //   }, 
    //   "size": 0
    // }
    )
  }
}
