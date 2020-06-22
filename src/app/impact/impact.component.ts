import { Component, OnInit } from '@angular/core';
import { interval, Observable } from 'rxjs';
@Component({
  selector: 'app-impact',
  templateUrl: './impact.component.html',
  styleUrls: ['./impact.component.css']
})
export class ImpactComponent implements OnInit {

  constructor() { }


  years = ['1600', '1700', '1820', '1870', '1913', '1930', '1940', '1950', '1990', 'Today'];

  yearImages = ['Until 1790.PNG', '1790-1815.PNG', '1816-1857.PNG', '1858-1918.PNG', '1930.PNG', '1947.PNG', '1990.png', 'TODAY.png'];
  yearImage = '../../assets/images/' + this.yearImages[0];

  timer = null;

  yearIndex = 0;
  limit = this.years.length;
  graphState = 'pause';

  intervalFunction: any = null;
  intervalTimer: any;


  ngOnInit(): void {
  }

  getImageyear(year) {

    var path = '../../assets/images/';

    if (year == 'Today') {
      this.yearImage = path + this.yearImages[7];
    } else {
      let ynum = parseInt(year);

      if (year <= 1790) {
        this.yearImage = path + this.yearImages[0];
      }
      if (year >= 1790 && year <= 1815) {
        this.yearImage = path + this.yearImages[1];
      }
      if (year >= 1816 && year <= 1857) {
        this.yearImage = path + this.yearImages[2];
      }
      if (year >= 1858 && year <= 1918) {
        this.yearImage = path + this.yearImages[3];
      }
      if (year >= 1919 && year <= 1930) {
        this.yearImage = path + this.yearImages[4];
      }

      if (year >= 1931 && year <= 1947) {
        this.yearImage = path + this.yearImages[5];
      }
      if (year >= 1947 && year <= 1990) {
        this.yearImage = path + this.yearImages[6];
      }
      if (year > 1991) {
        this.yearImage = path + this.yearImages[7];
      }

    }
  }

  gotoYear(year) {
    clearInterval(this.timer);
    this.graphState = 'goto';
    this.getImageyear(year);
    this.yearIndex = this.years.indexOf(year);
    this.pauseInterval();
  }


  updateyearImage() {
    this.getImageyear(this.years[this.yearIndex]);
  }

  /*
    play() {
      this.graphState = 'play';
      this.timer = setInterval(() => {
        this.yearIndex = (this.yearIndex + 1) % this.limit;
        this.updateyearImage();
        console.log('Year :', this.years[this.yearIndex]);
      }, 1000);
    }
    pause() {
      this.graphState = 'pause';
      clearInterval(this.timer);
    }
  */
  playInterval() {

    let prevstate = this.graphState;
    this.graphState = 'play';

    this.intervalTimer = interval(2000);
    this.intervalFunction = this.intervalTimer.subscribe(() => {

      if ((this.yearIndex + 1) % this.limit == 0 && prevstate != 'end') {
        // Reached Today so Pause and End Animation
        this.graphState = 'end';
        this.pauseInterval();
      } else {
        // Move to Next Year
        if (prevstate != 'goto') {
          this.yearIndex = (this.yearIndex + 1) % this.limit;
          this.updateyearImage();
       //   console.log('Year :', this.years[this.yearIndex]);
        }
        if (prevstate == 'goto') {
          prevstate = 'play';
        }
      }
    });
  }

  pauseInterval() {
    if (this.intervalFunction != null) {
      this.intervalFunction.unsubscribe();
    }
  }


  toggleState() {
    console.log('Toggling State');
    if (this.graphState == 'pause') {
      this.playInterval();
    } else if (this.graphState == 'play') {
      this.graphState = 'pause';
      this.pauseInterval();
    } else if (this.graphState == 'end') {
      this.playInterval();
    } else if (this.graphState == 'goto') {
      this.playInterval();
    }
  }

  isHighlight(year) {
    if (this.years[this.yearIndex] == year) {
      return true;
    } else {
      return false;
    }
  }

}
