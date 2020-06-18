import { Component, OnInit } from '@angular/core';
import * as rulers from '../../assets/data/rulers.json';

@Component({
  selector: 'app-rulers-contribution',
  templateUrl: './rulers-contribution.component.html',
  styleUrls: ['./rulers-contribution.component.css']
})
export class RulersContributionComponent implements OnInit {


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

  
  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.getRulers(1600, 1950);
  }

  updateContent(event) {
    this.fromyear = event.fromYear;
    this.toYear = event.toYear;
    console.log(rulers['default']);
    this.getRulers(this.fromyear, this.toYear);
  }


  getRulers(rfy, rty) {
    this.rulersToHighlight = [];
    this.rulerImages = [];
    this.rulerEvents = new Map();

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

    console.log('Rulers: ', this.rulersToHighlight);
    console.log('Images: ', this.rulerImages);
    console.log('Events: ', this.rulerEvents);



  }

  addRuler(ruler) {
    if (!this.rulersToHighlight.includes(ruler['Governors'])) {
      this.rulersToHighlight.push(ruler['Governors']);
      this.rulerEvents.set(ruler['Governors'], []);
    }

    if (ruler['Images'] != "") {
      if (this.rulersToHighlight.includes(ruler['Governors']) && !this.rulerImages.includes('../../../assets/images/Rulers/' + ruler['Images'])) {
        this.rulerImages.push('../../../assets/images/Rulers/' + ruler['Images']);
      }

      if (this.rulersToHighlight.includes(ruler['Governors']) && ruler['Events'] != "") {

        let evts = this.rulerEvents.get(ruler['Governors']);
        evts.push(ruler['Events']);
        this.rulerEvents.set(ruler['Governors'], evts);
      }

    }
  }

}
