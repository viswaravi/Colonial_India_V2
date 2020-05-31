import { Component, OnInit } from '@angular/core';
import * as data from '../../assets/data/Highlights_2.json';
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


  constructor() { }

  ngOnInit(): void {
    this.highlights = data['default'];
    // console.log('Highlights :', this.highlights);
    this.getPeople(1600, 1950);
    this.getYearHighlights(1600, 1950);
  }
  
  updateContent(event) {
    this.fromyear = event.fromYear;
    this.toYear = event.toYear;
    this.getPeople(this.fromyear, this.toYear);
    this.getYearHighlights(this.fromyear, this.toYear);
  }

  getPeople(rfy, rty) {
    this.peopleImages = [];
    console.log('Event Range to Extract People: ', rfy, rty);
    let efy, ety;
    this.highlights.forEach(event => {
      if (event.Years != "") {
        // Events having from and to Years
        if (event.Years.toString().length == 9) {
          efy = Number(event.Years.split('-')[0]);
          ety = Number(event.Years.split('-')[1]);
          if (((efy >= rfy && ety <= rty) || (efy >= rfy && efy <= rty) || (ety >= rfy && ety <= rty)) && event.People != "") {
            this.addPeoples(event['Person Photo']);
          }
        } else if (event.Years.toString().length == 4) {
          // Single Year 
          if (event.Years >= rfy && event.Years < rty && event.People != "") {
            this.addPeoples(event['Person Photo']);
          }
        }
      }
    });
    // console.log(this.peopleImages);
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
    console.log("Event:", event.id);
    this.getKeyHighlightsbyID(event.id + '.jpg');
  }


  getKeyHighlightsbyID(id) {
    this.keyHighlights = [];
    let colNames = ['Key highlight 1', 'Key highlight 2', 'Key highlight 3', 'Key highlight 4', 'Key highlight 5'];

    this.highlights.forEach(event => {
      let t = event['Person Photo'].split(',');
      if (t.includes(id)) {
        colNames.forEach(colName => {
          if (event[colName] != "" && !this.keyHighlights.includes(event[colName])) {
            this.keyHighlights.push(event[colName]);
          }
        });
      }
    });
  }

  updateHighlightsOUT(event) {
    console.log('Event Reverted');
    this.keyHighlights = this.backUpKeyHighlights;
  }

}

