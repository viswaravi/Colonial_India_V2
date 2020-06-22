import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { PageScrollService } from 'ngx-page-scroll-core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private pageScrollService: PageScrollService, @Inject(DOCUMENT) private document: any) {
  }

  title = 'ColonialIndiav2';
  isSticky = false;
  dispComponent = 'intro';
  section = 'pevents';
  isMobile = false;

  ngOnInit() {
    // console.log('WIDTH:', window.innerWidth);
    if (window.innerWidth < 1500) {
      this.isMobile = true;
    }
    if (window.innerWidth > 1500) {
      this.isMobile = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    // console.log('WIDTH:', window.innerWidth);
    if (window.innerWidth < 1500) {
      this.isMobile = true;
    }
    if (window.innerWidth > 1500) {
      this.isMobile = false;
    }
  }

  @ViewChild('navBar') navBar: ElementRef;


  @ViewChild('intro') intro: ElementRef;
  @ViewChild('lootedTreasure') lootedTreasure: ElementRef;
  @ViewChild('impacts') impacts: ElementRef;
  @ViewChild('lootedResource') lootedResource: ElementRef;
  @ViewChild('events') events: ElementRef;


  isDisp(cName) {

    if (this.dispComponent == 'events') {
      if (cName == this.section) {
        return TextTrackCueList;
      } else {
        return false;
      }
    } else {
      if (cName == this.dispComponent) {
        return true;
      } else {
        return false;
      }
    }
  }


  @HostListener('window:scroll', ['$event']) onScrollEvent($event) {
    // console.log(event);
    //  console.log(window.pageYOffset);

    if (window.pageYOffset > this.navBar.nativeElement.offsetTop) {
      this.isSticky = true;
    } else {
      this.isSticky = false;
    }


    //  console.log(window.pageYOffset);

    if (window.pageYOffset < 1173) {
      this.dispComponent = 'intro';
    }
    if (window.pageYOffset > 910 && window.pageYOffset < 1790) {
      this.dispComponent = 'lootedTreasure';
    }
    if (window.pageYOffset > 1790 && window.pageYOffset < 2700) {
      this.dispComponent = 'impacts';
    }

    if (window.pageYOffset > 2700 && window.pageYOffset < 3500) {
      this.dispComponent = 'lootedResource';
    }


    if (window.pageYOffset > 3500 && window.pageYOffset < 4520) {
      this.dispComponent = 'events';

      if (window.pageYOffset < 3650) {
        this.section = 'pevents';
      }

      if (window.pageYOffset > 3940) {
        this.section = 'cevents';
      }

    }

    if (window.pageYOffset > 4520 && window.pageYOffset < 4910) {
      this.dispComponent = 'rulers';
    }

    if (window.pageYOffset > 4910) {
      this.dispComponent = 'tail';
    }

  }


  scrollTo(id) {

    if (id == 'pevents' || id == 'cevents') {
      console.log(id);
      this.section = id;
      id = '#events';
    }


    this.pageScrollService.scroll({
      document: this.document,
      scrollOffset: 50,
      scrollTarget: id,
    });

  }

}

