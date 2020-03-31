import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.css']
})
export class CounterComponent implements OnInit {
  // total = 0
  // booking = 0
  // schedule = 0
  // health = 0

  constructor() { }

  ngOnInit(): void {
  }

  @Input() title : string
  @Input() total : number
  @Input() booking : number
  @Input() schedule : number
  @Input() health : number
  // @Input() from : string
  // @Input() to : string


}
