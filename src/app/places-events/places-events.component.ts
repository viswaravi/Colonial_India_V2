import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as data from '../../assets/data/Highlights_2.json';
import * as events from '../../assets/data/formatted_events.json';

@Component({
  selector: 'app-places-events',
  templateUrl: './places-events.component.html',
  styleUrls: ['./places-events.component.css']
})
export class PlacesEventsComponent implements OnInit {


  fromyear: Number;
  toYear: Number;
  highlights: any;
  peopleImages = [];
  keyHighlights = [];
  backUpKeyHighlights = [];
  placesToHighlight = [];
  backUpPlacesToHighlight = [];
  isPeople = true;
  historicalEvents = [];

  constructor() { }


  toggleContent() {
    this.isPeople = !this.isPeople;
  }

  ngOnInit(): void {
    //  this.highlights = data['default'];
    // console.log('Highlights :', this.highlights);
    // this.getPeople(1600, 1950);
    // this.getYearHighlights(1600, 1950);
  }


  ngAfterViewInit() {
    this.highlights = data['default'];
    // console.log('Highlights :', this.highlights);
    this.getPeople(1600, 1950);
    this.getYearHighlights(1600, 1950);
    this.getEvents(1600, 1950);
  }


  updateContent(event) {
    this.fromyear = event.fromYear;
    this.toYear = event.toYear;
    this.getPeople(this.fromyear, this.toYear);
    this.getYearHighlights(this.fromyear, this.toYear);
    this.getEvents(this.fromyear, this.toYear);
  }



  getEvents(rfy, rty) {
    this.historicalEvents = [];
    let efy, ety;
    events['default'].forEach(event => {
      if (event.Years != "") {
        // Events having from and to Years
        if (event.Years.toString().length == 9) {
          efy = Number(event.Years.split('-')[0]);
          ety = Number(event.Years.split('-')[1]);
          if (((efy >= rfy && ety <= rty) || (efy >= rfy && efy <= rty) || (ety >= rfy && ety <= rty)) && event.People != "") {
            this.historicalEvents.push(event);
          }
        } else if (event.Years.toString().length == 4) {
          // Single Year 
          if (event.Years >= rfy && event.Years < rty) {
            this.historicalEvents.push(event);
          }
        }
      }
    });
    //    console.log(this.historicalEvents);
  }



  getPeople(rfy, rty) {
    this.peopleImages = [];
    this.placesToHighlight = [];
    // console.log('Event Range to Extract People: ', rfy, rty);
    let efy, ety;
    this.highlights.forEach(event => {
      if (event.Years != "") {
        // Events having from and to Years
        if (event.Years.toString().length == 9) {
          efy = Number(event.Years.split('-')[0]);
          ety = Number(event.Years.split('-')[1]);
          if (((efy >= rfy && ety <= rty) || (efy >= rfy && efy <= rty) || (ety >= rfy && ety <= rty)) && event.People != "") {
            this.addPeoples(event['Person Photo']);
            this.addPlaces(event['Places']);
          }
        } else if (event.Years.toString().length == 4) {
          // Single Year 
          if (event.Years >= rfy && event.Years < rty && event.People != "") {
            this.addPeoples(event['Person Photo']);
            this.addPlaces(event['Places']);
          }
        }
      }
    });
    // console.log(this.peopleImages);
    //console.log('Added Places :', this.placesToHighlight);
    this.backUpPlacesToHighlight = this.placesToHighlight;
  }

  addPeoples(peoples) {
    peoples.split(',').forEach(photo => {
      if (photo != "") {
        if (!this.peopleImages.includes(photo.trim())) {
          this.peopleImages.push(photo.trim());
        }
      }
    });
  }

  getYearHighlights(rfy, rty) {

    this.keyHighlights = [];
    console.log('Event Range to Extract Key Highlights: ', rfy, rty);
    let efy, ety;
    this.highlights.forEach(event => {
      if (event.Years != "") {
        // Events having from and to Years
        if (event.Years.toString().length == 9) {
          efy = Number(event.Years.split('-')[0]);
          ety = Number(event.Years.split('-')[1]);
          if (((efy >= rfy && ety <= rty) || (efy >= rfy && efy <= rty) || (ety >= rfy && ety <= rty))) {
            this.getHighlights(event);
          }
        } else if (event.Years.toString().length == 4) {
          // Single Year 
          if (event.Years >= rfy && event.Years < rty) {
            this.getHighlights(event);
          }
        }
      }
    });
    this.backUpKeyHighlights = this.keyHighlights;
  }

  getHighlights(event) {
    let colNames = ['Key highlight 1', 'Key highlight 2', 'Key highlight 3', 'Key highlight 4', 'Key highlight 5'];

    colNames.forEach(colName => {
      if (event[colName] != "" && !this.keyHighlights.includes(event[colName])) {
        this.keyHighlights.push(event[colName]);
      }
    });
  }

  updateHighlightsIN(event) {
    // console.log("Person:", event.id + '.jpg');
    this.getKeyHighlightsbyID(event.id + '.jpg');
  }


  getKeyHighlightsbyID(id) {
    this.keyHighlights = [];
    this.placesToHighlight = [];
    let colNames = ['Key highlight 1', 'Key highlight 2', 'Key highlight 3', 'Key highlight 4', 'Key highlight 5'];

    this.highlights.forEach(event => {
      let t = event['Person Photo'].split(',');
      if (t.includes(id)) {
        colNames.forEach(colName => {
          if (event[colName] != "" && !this.keyHighlights.includes(event[colName])) {
            this.keyHighlights.push(event[colName]);
            this.addPlaces(event['Places']);
          }
        });
      }
    });
    //  console.log('Places for this Person:', this.placesToHighlight);
  }

  updateHighlightsOUT(event) {
    // console.log('Event Reverted');
    this.keyHighlights = this.backUpKeyHighlights;
    this.placesToHighlight = this.backUpPlacesToHighlight;
  }


  addPlaces(places) {
    let p = places.split(',');

    p.map(place => {
      if (place != "" && !this.placesToHighlight.includes(place)) {
        this.placesToHighlight.push(place.trim());
      }
    });
  }

}

