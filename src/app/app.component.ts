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

  @ViewChild('navBar') navBar: ElementRef;


  @ViewChild('intro') intro: ElementRef;
  @ViewChild('lootedTreasure') lootedTreasure: ElementRef;
  @ViewChild('impacts') impacts: ElementRef;
  @ViewChild('lootedResource') lootedResource: ElementRef;
  @ViewChild('events') events: ElementRef;



  @HostListener('window:scroll', ['$event']) onScrollEvent($event) {
    // console.log(event);
   // console.log(window.pageYOffset);
  
    if (window.pageYOffset > this.navBar.nativeElement.offsetTop) {
      this.isSticky = true;
    } else {
      this.isSticky = false;
    }

  }

  scrollTo(id) {
    this.pageScrollService.scroll({
      document: this.document,
      scrollOffset: 50,
      scrollTarget: id,
    });
  }

}

