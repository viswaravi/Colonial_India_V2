import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import * as data from '../../assets/data/Highlights_2.json';
import * as events from '../../assets/data/formatted_events.json';

@Component({
  selector: 'app-places-events',
  templateUrl: './places-events.component.html',
  styleUrls: ['./places-events.component.css']
})
export class PlacesEventsComponent implements OnInit {

  @Input() private sectionName: any;

  fromyear: Number;
  toYear: Number;
  highlights: any;
  peopleImages = [];
  keyHighlights = [];
  backUpKeyHighlights = [];
  placesToHighlight = [];
  backUpPlacesToHighlight = [];
  backUpImages = [];
  isPeople = true;

  //Events
  historicalEvents = [];
  HEvents = new Map();
  eventNames = [];

  // MapZoom
  zoom = 180;

  ngOnChanges(changes: SimpleChanges): void {

    if (this.sectionName == 'pevents') {
    //  console.log('pevents');
      this.isPeople = true;
    } else if (this.sectionName == 'cevents') {
      //console.log('cevents');
      this.isPeople = false;
    }
  }

  /**
  {
    event:'',
    image:'',
    data:[
      year:'',
      text:''
    ]
  } 
  */

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

    //console.log('HE:', this.HEvents);
  }


  updateContent(event) {
    this.fromyear = event.fromYear;
    this.toYear = event.toYear;
    this.getPeople(this.fromyear, this.toYear);
    this.getYearHighlights(this.fromyear, this.toYear);
    this.getEvents(this.fromyear, this.toYear);

   
   // console.log('HE:', this.HEvents);
  }

  getEvents(rfy, rty) {
    this.historicalEvents = [];
    this.HEvents = new Map();
    let efy, ety;
    events['default'].forEach(event => {
      if (event.Years != "") {
        // Events having from and to Years
        if (event.Years.toString().length == 9) {
          efy = Number(event.Years.split('-')[0]);
          ety = Number(event.Years.split('-')[1]);
          if (((efy >= rfy && ety <= rty) || (efy >= rfy && efy <= rty) || (ety >= rfy && ety <= rty)) && event.People != "") {
            this.historicalEvents.push(event);
            this.addEvent(event);
          }
        } else if (event.Years.toString().length == 4) {
          // Single Year 
          if (event.Years >= rfy && event.Years < rty) {
            this.historicalEvents.push(event);
            this.addEvent(event);
          }
        }
      }
    });
    //    console.log(this.historicalEvents);
  }

  addEvent(event) {
    if (!this.HEvents.has(event['Event'])) {
      this.HEvents.set(event['Event'], {
        image: event['Image'],
        data: []
      });
    }

    let obj = this.HEvents.get(event['Event']);
    obj.data.push({
      year: event['Years'],
      text: event['Text']
    });

    if (!this.eventNames.includes(event['Event'])) {
      this.eventNames.push(event['Event']);
    }

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
    this.backUpImages = this.peopleImages;
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
   // console.log('Event Range to Extract Key Highlights: ', rfy, rty);
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


  // Person Hover
  updateHighlightsPersonIN(event) {
    // console.log("Person:", event.id + '.jpg');
    this.getKeyHighlightsbyID(event.id + '.jpg');
  }


  getKeyHighlightsbyID(id) {
    this.keyHighlights = [];
    this.placesToHighlight = [];
    let colNames = ['Key highlight 1', 'Key highlight 2', 'Key highlight 3', 'Key highlight 4', 'Key highlight 5'];

    this.highlights.forEach(event => {

      let rfy = this.fromyear;
      let rty = this.toYear;
      let efy, ety;

      if (event.Years != "") {
        // Events having from and to Years
        if (event.Years.toString().length == 9) {
          efy = Number(event.Years.split('-')[0]);
          ety = Number(event.Years.split('-')[1]);
          if (((efy >= rfy && ety <= rty) || (efy >= rfy && efy <= rty) || (ety >= rfy && ety <= rty)) && event.People != "") {
            // Add Highlights
            /////////////////////
            let t = [];
            event['Person Photo'].split(',').map(person => {
              t.push(person.trim());
            });

            if (t.includes(id)) {
              colNames.forEach(colName => {
                if (event[colName] != "" && !this.keyHighlights.includes(event[colName])) {
                  this.keyHighlights.push(event[colName]);
                  this.addPlaces(event['Places']);
                }
              });
            }
            ///////////////////      

          }
        } else if (event.Years.toString().length == 4) {
          // Single Year 
          if (event.Years >= rfy && event.Years < rty) {
            // Add Highlights
            ///////////////////
            let t = event['Person Photo'].split(',');
            if (t.includes(id)) {
              colNames.forEach(colName => {
                if (event[colName] != "" && !this.keyHighlights.includes(event[colName])) {
                  this.keyHighlights.push(event[colName]);
                  this.addPlaces(event['Places']);
                }
              });
            }

            ///////////////////

          }
        }
      }

    });
    //  console.log('Places for this Person:', this.placesToHighlight);
  }

  updateHighlightsPersonOUT(event) {
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


  // Place Hover
  updateHighlightsPlaceIN(pevent) {
    console.log("Place:", pevent.place);
    this.keyHighlights = [];
    this.peopleImages = [];

    let colNames = ['Key highlight 1', 'Key highlight 2', 'Key highlight 3', 'Key highlight 4', 'Key highlight 5'];

    this.highlights.forEach(event => {


      let t = [];
      event['Places'].split(',').map(place => {
        t.push(place.trim());
      });
      if (t.includes(pevent.place)) {
        this.addPeoples(event['Person Photo']);
        colNames.forEach(colName => {
          if (event[colName] != "" && !this.keyHighlights.includes(event[colName])) {
            this.keyHighlights.push(event[colName]);
          }
        });
      }
    });
  }

  updateHighlightsPlaceOUT(event) {
   // console.log('Place Revert');
    this.keyHighlights = this.backUpKeyHighlights;
    this.peopleImages = this.backUpImages;
  }


  // Key Event Hover
  updatePeoplPlacesIN(kevent) {
   // console.log('IN_H', kevent.key);

    let rfy = this.fromyear;
    let rty = this.toYear;
    let efy, ety;

    this.peopleImages = [];
    this.placesToHighlight = [];

    let colNames = ['Key highlight 1', 'Key highlight 2', 'Key highlight 3', 'Key highlight 4', 'Key highlight 5'];

    this.highlights.forEach(event => {
      let isPresent = false;
      if (event.Years != "") {
        // Events having from and to Years
        if (event.Years.toString().length == 9) {
          efy = Number(event.Years.split('-')[0]);
          ety = Number(event.Years.split('-')[1]);
          if (((efy >= rfy && ety <= rty) || (efy >= rfy && efy <= rty) || (ety >= rfy && ety <= rty)) && event.People != "") {
            // Add Highlights
            /////////////////////
            colNames.forEach(colName => {
              if (event[colName] != "" && event[colName] == kevent.key) {
                isPresent = true;
              }
            });

            ///////////////////      
          }
        } else if (event.Years.toString().length == 4) {
          // Single Year 
          if (event.Years >= rfy && event.Years < rty) {
            // Add Highlights
            ///////////////////
            colNames.forEach(colName => {
              if (event[colName] != "" && event[colName] == kevent.key) {
                isPresent = true;
              }
            });
            ///////////////////

          }
        }
      }

      if (isPresent) {
      //  console.log(event);
        this.addPeoples(event['Person Photo']);
        this.addPlaces(event['Places']);
      }
    });
  }

  updatePeoplPlacesOUT() {
   // console.log('OUT_H');
    this.peopleImages = this.backUpImages;
    this.placesToHighlight = this.backUpPlacesToHighlight;
  }

  zoomInMap() {
    if (this.zoom == 180) {
      this.zoom = 200;
    }
    if (this.zoom == 200) {
      this.zoom = 220;
    }
  }

  zoomOutMap() {
    if (this.zoom == 220) {
      this.zoom = 200;
    }
    if (this.zoom == 200) {
      this.zoom = 180;
    }

  }
}

