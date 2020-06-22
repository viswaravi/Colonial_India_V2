import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-historical-events',
  templateUrl: './historical-events.component.html',
  styleUrls: ['./historical-events.component.css']
})
export class HistoricalEventsComponent implements OnInit {

  @Input() public events: Array<any>;
  @Input() public hevents: any;
  @Input() public eventNames: any;


  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {

    let modifiedEvents = [];

    this.events.map(event => {
   //  event.Text = event['Text'].split(':');
      modifiedEvents.push(event);
    });

    // console.log(this.events);
  }

}
