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

  intervalFunction: any;
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

  showSingleYear(year) {
    this.graphState = 'pause';
    clearInterval(this.timer);
    this.getImageyear(year);
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
    this.graphState = 'play';
    this.intervalTimer = interval(1000);
    this.intervalFunction = this.intervalTimer.subscribe(() => {
      this.yearIndex = (this.yearIndex + 1) % this.limit;
      this.updateyearImage();
      console.log('Year :', this.years[this.yearIndex]);
    });
  }

  pauseInterval() {
    this.graphState = 'pause';
    this.intervalFunction.unsubscribe();
  }




  toggleState() {
    if (this.graphState == 'pause') {
      this.playInterval();
    } else if (this.graphState == 'play') {
      this.pauseInterval();
    }
  }

  reset() {
    this.graphState = 'pause';
    this.yearIndex = 0;
    clearInterval(this.timer);
  }

  isHighlight(year) {
    if (this.years[this.yearIndex] == year) {
      return true;
    } else {
      return false;
    }
  }

}
