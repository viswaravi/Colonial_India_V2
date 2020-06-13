import { Component, SimpleChanges, OnInit, ViewChild, Input, ElementRef, AfterViewInit, Output, EventEmitter, OnChanges } from '@angular/core';
import * as d3 from 'd3';
import * as data from '../../../assets/data/People.json';

@Component({
  selector: 'app-peoples-map-boxed',
  templateUrl: './peoples-map.component.html',
  styleUrls: ['./peoples-map.component.css']
})
export class PeoplesMapBoxedComponent implements OnInit {


  indianPeople = [];
  @ViewChild('chart', { static: false }) private chartContainer: ElementRef;
  @Input() private peopleImages: Array<any>;
  @Output() INpersonHighlight = new EventEmitter<{ id: String }>();
  @Output() OUTpersonHighlight = new EventEmitter<{}>();

  margin: any = { top: 0, bottom: 0, left: 0, right: 0 };
  chart: any;
  width: number;
  height: number;
  xScale: any;
  yScale: any;
  xAxis: any;
  yAxis: any;
  svg: any;

  // Force Bubble Properties
  forceStrength: any;
  centre: any;
  nodes: any;
  bubbles: any;
  labels: any;
  elements: any;
  patterns: any
  simulation: any;
  radius = 17;
  diameter = this.radius * 2;
  highlightPersonID: String;

  constructor() { }
  ngOnInit() {
    this.highlightPersonID = null;
  }

  ngAfterViewInit() {
    this.createCustomChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.peopleImages) {
      if (this.peopleImages != []) {
        //  console.log('People Image Data Changed ', this.peopleImages);
        this.updateCustomChart();
      }
    }
  }

  charge(d) {
    return Math.pow(d.radius, 1) * 10;
  }

  createCustomChart() {
    let element = this.chartContainer.nativeElement;
    //Need Space for Labels s0 subtract space required to get Heigh and Width of SVG
    this.width = 800;
    this.height = 300;
    this.svg = d3.select(element).append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    // chart plot area
    this.chart = this.svg.append('g')
      .attr('class', 'indianPeople')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    // console.log(this.width, this.height);

  }


  getPosY(index) {
    let y = 0;
    //  Nodes in a Row
    let NROW = 18;
    let t = index / NROW;
    y = parseInt(t.toString().split('.')[0]);
    if (index % NROW > 0 || y == 0) {
      y = y + 1;
    }
    if (y == 0) {
      return (y * (this.diameter));
    }

    // radius - 13 diameter - 26, add for spacing
    return (y * (this.diameter + 10));
  }

  getPosX(index) {
    let NROW = 18;

    let rem = index % NROW;

    if (rem == 0) {
      rem = rem + 1;
    }

    return ((rem * (this.diameter + 10)));
  }

  createNodes() {
    // use max size in the data as the max in the scale's domain
    // note we have to ensure that size is a number
    let maxSize = 90;

    // size bubbles based on area
    const radiusScale = d3.scaleSqrt()
      .domain([0, maxSize])
      .range([0, 75])

    // console.log('NO of PEOPLE :', this.peopleImages.length)

    // use map() to convert raw data into node data
    const myNodes = this.peopleImages.map((d, index) => ({
      id: d,
      radius: 15,
      size: 30,
      x: this.getPosX(index),
      y: this.getPosY(index)
    }))
    return myNodes;
  }

  getOffsetX(x) {
    let n = 100;
    if (x < n) {
      return n;
    }
    if (x > this.width - n) {
      return -n - 10;
    }
    return 0;
  }

  getOffsetY(y) {
    let n = 100;
    if (y < n) {
      return n;
    }
    if (y > this.height - n) {
      return -n - 30;
    }
    return 0;

  }


  getFontSize(name) {
    if (name.length >= 25) {
      return 7;
    }
    if (name.length >= 15) {
      return 11;
    } else {
      return 15;
    }
  }


  updateCustomChart() {

    // Remove existing Nodes
    this.nodes = this.createNodes();

    //  console.log('Nodes: ', this.nodes);

    this.svg.selectAll('.bubble').remove();
    this.svg.selectAll('.cImage').remove();

    // bind nodes data to circle elements
    this.elements = this.chart.selectAll('.bubble')
      .data(this.nodes)
      .enter()
      .append('g');

    // console.log(this.elements);

    this.bubbles = this.elements
      .append('circle')
      .attr('id', d => d['id'].split('.')[0])
      .attr('class', 'bubble')
      .attr('r', this.radius)
      .attr('cx', d => d['x'])
      .attr('cy', d => d['y'])
      .attr('stroke', '#23A8F2')
      .attr('stroke-width', 2)
      .attr('fill', d => 'url(#' + d['id'] + ')');

    this.peopleImages.forEach(people => {
      this.patterns = this.svg.append('pattern')
        .attr('id', people)
        .attr('class', 'cImage')
        .attr('height', '100%')
        .attr('width', '100%')
        .attr('patternContentUnits', 'objectBoundingBox')
        .append('image')
        .attr('height', '1')
        .attr('width', '1')
        .attr('preserveAspectRatio', 'none')
        .attr('xlink:href', './../../../assets/images/People/' + people);
    });


    this.bubbles.on('mouseover', () => {
      //   console.log('Mouse Hover', d3.event);
      // console.log('Mouse Hover', d3.event.target.cx);

      this.INpersonHighlight.emit({ id: d3.event.target.id });

      // White Background for Highlight
      /*this.svg.append('rect')
        .attr('id', 'tempRect')
        .attr('class', 'imgBack')
        .attr('height', 120)
        .attr('width', 170)
        .attr('x', d3.event.target.cx.baseVal.value - 85 + this.getOffsetX(d3.event.target.cx.baseVal.value))
        .attr('y', d3.event.target.cy.baseVal.value + this.getOffsetY(d3.event.target.cy.baseVal.value))
        .attr("cursor", "ns-resize")
        .style('fill', 'white');
      */

      let x = d3.event.target.cx.baseVal.value - 85 + this.getOffsetX(d3.event.target.cx.baseVal.value);
      let y = d3.event.target.cy.baseVal.value + this.getOffsetY(d3.event.target.cy.baseVal.value);

      this.svg.append('path')
        .attr('d', d => {
          let p = this.rightRoundedRect(x, y, 170, 120, 10);
          return p;
        })
        .attr('id', 'tempRect')
        .attr('class', 'imgBack')
        .attr("cursor", "ns-resize")
        .style('fill', 'white');


      // Circle Image
      this.svg.append('circle')
        .attr('id', 'temp')
        .attr('class', 'bubble')
        .attr('r', 70)
        .attr('cx', d3.event.target.cx.baseVal.value + this.getOffsetX(d3.event.target.cx.baseVal.value))
        .attr('cy', d3.event.target.cy.baseVal.value + this.getOffsetY(d3.event.target.cy.baseVal.value))
        .attr('stroke', '#62340F')
        .attr('stroke-width', 2)
        .attr('fill', d => 'url(#' + d3.event.target.id + '.jpg)');


      // Name on Background
      this.svg.append('text')
        .attr('id', 'tempText')
        .attr('x', d3.event.target.cx.baseVal.value - 60 + this.getOffsetX(d3.event.target.cx.baseVal.value))
        .attr('y', d3.event.target.cy.baseVal.value + 90 + this.getOffsetY(d3.event.target.cy.baseVal.value))
        .attr('font-family', 'montserratBold')
        .attr('font-color', 'black')
        .attr('word-wrap', 'break-word')
        .attr('letter-spacing', 0.2)
        .attr('font-size', this.getFontSize(d3.event.target.id))
        .text(d3.event.target.id.split('_').join(' '));
    });


    this.bubbles.on('mouseout', () => {
      this.OUTpersonHighlight.emit({});
      this.svg.selectAll('#temp').remove();
      this.svg.selectAll('#tempText').remove();
      this.svg.selectAll('#tempRect').remove();
      this.highlightPersonID = null;
      // this.simulation.restart();
    });

    //  console.log('Bubbles: ', this.bubbles);
    //  console.log('Labels: ', this.labels);

  }

  rightRoundedRect(x, y, width, height, radius) {
    return "M" + x + "," + y
      + "h" + (width - radius)
      + "a" + radius + "," + radius + " 0 0 1 " + radius + "," + radius
      + "v" + (height - 2 * radius)
      + "a" + radius + "," + radius + " 0 0 1 " + -radius + "," + radius
      + "h" + (radius - width)
      + "z";
  }

  getRadius(id) {
    if (this.highlightPersonID == null) {
      return this.radius;
    } else {
      if (id == this.highlightPersonID) {
        return 100;
      } else {
        return this.radius;
      }
    }
  }

}
