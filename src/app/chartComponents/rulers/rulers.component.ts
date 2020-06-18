import { Component, SimpleChanges, OnInit, ViewChild, Input, ElementRef, AfterViewInit, Output, EventEmitter, OnChanges } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-rulers',
  templateUrl: './rulers.component.html',
  styleUrls: ['./rulers.component.css']
})
export class RulersComponent implements OnInit {


  @ViewChild('chart', { static: false }) private chartContainer: ElementRef;
  @Input() private rulersToHighlight: Array<any>;
  @Input() public rulersImages: Array<any>;
  @Input() private rulersEvents: any;

  margin: any = { top: 0, bottom: 0, left: 0, right: 0 };
  chart: any;
  width: number;
  height: number;
  xScale: any;
  yScale: any;
  xAxis: any;
  yAxis: any;
  elements: any;
  bubbles: any;
  svg: any;
  patterns: any;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    //this.createCustomChart();
  }


  ngOnChanges(changes: SimpleChanges) {
    //    console.log('Rulers :', this.rulersToHighlight);
   // console.log('Images :', this.rulersImages);
    //  console.log('Events :', this.rulersEvents);
    //  this.updateCustomChart();
  }

  reload(){
  //  this.rulersImages = [...this.rulersImages];
  }

  createCustomChart() {
    let element = this.chartContainer.nativeElement;
    //Need Space for Labels s0 subtract space required to get Heigh and Width of SVG
    this.width = 300;
    this.height = 500;
    this.svg = d3.select(element).append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('overflow', 'scroll');

    // chart plot area
    this.chart = this.svg.append('g')
      .attr('class', 'rulerPeople')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
      .attr('overflow', 'scroll');
  }

  getPosY(index) {
    return (index + 1) * 40;
  }

  updateCustomChart() {
    this.elements = this.chart.selectAll('.bubble')
      .data(this.rulersImages)
      .enter()
      .append('g');

    // 
    this.bubbles = this.elements
      .append('circle')
      .attr('class', 'bubble')
      .attr('r', 30)
      .attr('cx', 50)
      .attr('cy', (d, i) => this.getPosY(i))
      .attr('stroke', '#23A8F2')
      .attr('stroke-width', 2)
      .attr('fill', d => 'url(#' + d + ')');

    this.rulersImages.forEach(ruler => {
      this.svg.append('pattern')
        .attr('id', ruler)
        .attr('class', 'cImage')
        .attr('height', '100%')
        .attr('width', '100%')
        .attr('patternContentUnits', 'objectBoundingBox')
        .append('image')
        .attr('height', '1')
        .attr('width', '1')
        .attr('preserveAspectRatio', 'none')
        .attr('xlink:href', '../../../assets/images/Rulers/Lord Amherst.jpg');

    });

  }

  getName(url) {

    let s = url.split('/');

    let name = s[s.length - 1];
    name = name.split('.')[0];
    return name;
  }



}
