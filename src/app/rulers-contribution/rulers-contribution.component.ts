import { Component, OnInit, ViewChild, ElementRef, SimpleChanges } from '@angular/core';
import * as rulers from '../../assets/data/rulers.json';

@Component({
  selector: 'app-rulers-contribution',
  templateUrl: './rulers-contribution.component.html',
  styleUrls: ['./rulers-contribution.component.css']
})
export class RulersContributionComponent implements OnInit {


  @ViewChild("rulersData") dataView: ElementRef;

  fromyear: Number;
  toYear: Number;
  highlights: any;
  peopleImages = [];
  keyHighlights = [];
  backUpKeyHighlights = [];
  placesToHighlight = [];
  backUpPlacesToHighlight = [];

  // Ruler Data
  rulersToHighlight = [];
  rulerImages = [];
  rulerEvents = new Map();
  rulersYears = new Map();

  // Hover
  isHovering = false;
  currentContribution = '';
  currentRuler = '';


  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.dataView.nativeElement.scrollTop = 500;
  }

  ngAfterViewInit() {
    this.getRulers(1600, 1950);
    console.log(this.dataView.nativeElement);
  }

  updateContent(event) {
    this.fromyear = event.fromYear;
    this.toYear = event.toYear;
   // console.log(rulers['default']);
    this.getRulers(this.fromyear, this.toYear);
  }


  getRulers(rfy, rty) {
    this.rulersToHighlight = [];
    this.rulerImages = [];
    this.rulerEvents = new Map();
    this.rulersYears = new Map();

    let efy, ety;

    rulers['default'].map(ruler => {

      if (ruler.Years != "") {
        // Events having from and to Years
        if (ruler.Years.toString().length == 9) {
          efy = Number(ruler.Years.split('-')[0]);
          ety = Number(ruler.Years.split('-')[1]);
          if (((efy >= rfy && ety <= rty) || (efy >= rfy && efy <= rty) || (ety >= rfy && ety <= rty))) {
            this.addRuler(ruler);
          }
        } else if (ruler.Years.toString().length == 4) {
          // Single Year 
          if (ruler.Years >= rfy && ruler.Years < rty) {
            this.addRuler(ruler);
          }
        }
      }
    });

    //  console.log('Rulers: ', this.rulersToHighlight);
    //  console.log('Images: ', this.rulerImages);
    //  console.log('Events: ', this.rulerEvents);

    this.addEvents();

  }

  addEvents() {
    rulers['default'].map(ruler => {

      if (this.rulersToHighlight.includes(ruler['Governors']) && ruler['Events'] != "") {

        let evts = this.rulerEvents.get(ruler['Governors']);
        evts.push(ruler['Events']);
        this.rulerEvents.set(ruler['Governors'], evts);
      }

    });
  }


  addRuler(ruler) {
    if (!this.rulersToHighlight.includes(ruler['Governors'])) {
      this.rulersToHighlight.push(ruler['Governors']);
      this.rulerEvents.set(ruler['Governors'], []);
      this.rulersYears.set(ruler['Governors'], ruler['Years']);

      if (ruler['Events'] != "") {
        let evts = this.rulerEvents.get(ruler['Governors']);
        evts.push(ruler['Events']);
        this.rulerEvents.set(ruler['Governors'], evts);
      }
    }

    if (ruler['Images'] != "") {
      if (this.rulersToHighlight.includes(ruler['Governors']) && !this.rulerImages.includes('../../../assets/images/Rulers/' + ruler['Images'])) {
        this.rulerImages.push('../../../assets/images/Rulers/' + ruler['Images']);
      }
    }
  }

  rulerContributionsIN(event) {
    console.log('Ruler IN:', event.name);
    this.isHovering = true;
    this.currentContribution = this.rulerEvents.get(event.name);
    this.currentRuler = event.name;
  }

  rulerContributionsOUT() {
    console.log('Ruler OUT');
    this.isHovering = false;
    this.currentContribution = '';
  }



}
