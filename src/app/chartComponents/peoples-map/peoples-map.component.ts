import { Component, SimpleChanges, OnInit, ViewChild, Input, ElementRef, AfterViewInit, Output, EventEmitter, OnChanges } from '@angular/core';
import * as d3 from 'd3';
import * as data from '../../../assets/data/People.json';

@Component({
  selector: 'app-peoples-map',
  templateUrl: './peoples-map.component.html',
  styleUrls: ['./peoples-map.component.css']
})
export class PeoplesMapComponent implements OnInit {


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
  radius = 13;
  highlightPersonID: String;

  constructor() { }
  ngOnInit() {
    this.highlightPersonID = null;
    /* 
      let people = data['default'];
      this.indianPeople = people.filter(this.indiaFilter);
      console.log(this.indianPeople);
    */
  }

  indiaFilter(people, index, array) {
    if (people['Country'] == 'Indian') {
      return true;
    } else {
      return false;
    }
  }


  ngAfterViewInit() {
    this.createCustomChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.peopleImages) {
      if (this.peopleImages != []) {
        console.log('People Image Data Changed ', this.peopleImages);
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
    this.width = 600;
    this.height = 400;
    this.svg = d3.select(element).append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    // chart plot area
    this.chart = this.svg.append('g')
      .attr('class', 'indianPeople')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    console.log(this.width, this.height);

    this.centre = { x: this.width / 2, y: this.height / 2 };
    this.forceStrength = 10;


    // create a force simulation and add forces to it
    this.simulation = d3.forceSimulation()
      .force('charge', d3.forceManyBody().strength(this.charge))
      // .force('center', d3.forceCenter(centre.x, centre.y))
      .force('x', d3.forceX().strength(this.forceStrength).x(this.centre.x))
      .force('y', d3.forceY().strength(this.forceStrength).y(this.centre.y))
      .force('collision', d3.forceCollide().radius(d => d['radius']));

    // this.simulation.stop();
  }


  createNodes() {
    // use max size in the data as the max in the scale's domain
    // note we have to ensure that size is a number
    let maxSize = 90;

    // size bubbles based on area
    const radiusScale = d3.scaleSqrt()
      .domain([0, maxSize])
      .range([0, 75])

    // use map() to convert raw data into node data
    const myNodes = this.peopleImages.map(d => ({
      id: d,
      radius: radiusScale(6),
      size: 30,
      x: Math.random() * this.width,
      y: Math.random() * this.height
    }))
    return myNodes;
  }


  updateCustomChart() {

    // Remove existing Nodes
    this.nodes = this.createNodes();


    console.log('Nodes: ', this.nodes);

    this.chart.selectAll('.bubble').remove();
    this.chart.selectAll('.cImage').remove();

    this.simulation = d3.forceSimulation()
      .force('charge', d3.forceManyBody().strength(this.charge))
      // .force('center', d3.forceCenter(centre.x, centre.y))
      .force('x', d3.forceX().strength(this.forceStrength).x(this.centre.x))
      .force('y', d3.forceY().strength(this.forceStrength).y(this.centre.y))
      .force('collision', d3.forceCollide().radius(d => d['radius']));

    //  this.simulation.stop();


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
      console.log('Mouse Hover', d3.event);
      // console.log('Mouse Hover', d3.event.target.cx);

      this.INpersonHighlight.emit({ id: d3.event.target.id });

      this.svg.append('circle')
        .attr('id', 'temp')
        .attr('class', 'bubble')
        .attr('r', 70)
        .attr('cx', d3.event.target.cx.baseVal.value)
        .attr('cy', d3.event.target.cy.baseVal.value)
        .attr('stroke', '#62340F')
        .attr('stroke-width', 2)
        .attr('fill', d => 'url(#' + d3.event.target.id + '.jpg)');


      /*
    this.svg.append('rect')
    .attr('class', 'imgBack')
    .attr('width', 60)
    .attr('x', d3.event.target.cx.baseVal.value)
    .attr('y', d3.event.target.cy.baseVal.value)
    .attr('height', 535)
    .attr('rx', 5)
    .attr('ry', 5)
    .attr("cursor", "ns-resize")
    .style('fill', 'white');
*/

      this.svg.append('text')
        .attr('id', 'tempText')
        .attr('x', d3.event.target.cx.baseVal.value)
        .attr('y', d3.event.target.cy.baseVal.value + 90)
        .attr('font-family', 'bodoniItalic')
        .attr('font-colot', 'white')
        .text(d3.event.target.id);


      // this.highlightPersonID = d3.event.target['__data__']['id'];
      /*
      let name = '#' + d3.event.target['__data__']['id'].split('.')[0];
      console.log(name);
      let elt = d3.select(name);
      console.log(elt['_groups'][0]);
      this.bubbles.select(elt['_groups'][0]).raise();
      */
      //  this.simulation.restart();
    });
    this.bubbles.on('mouseout', () => {
      this.OUTpersonHighlight.emit({});
      this.svg.selectAll('#temp').remove();
      this.svg.selectAll('#tempText').remove();
      this.highlightPersonID = null;
      // this.simulation.restart();
    });
    /*
    // labels
    this.labels = this.elements
      .append('text')
      .attr('dy', '.3em')
      .style('text-anchor', 'middle')
      .text(d => d['Name'])
      .style('font-size', 10)
    */
    console.log('Bubbles: ', this.bubbles);
    console.log('Labels: ', this.labels);

    this.simulation.nodes(this.nodes)
      .on('tick', () => {

        let tbubbles = this.elements.selectAll('.bubble');
        // console.log(tbubbles);

        tbubbles
          .attr('cx', d => Math.max(this.radius + 10, Math.min(this.width - this.radius + 10, d['x'])))
          .attr('cy', d => Math.max(this.radius + 10, Math.min(this.height - this.radius + 10, d['y'])))
          .attr('r', d => this.getRadius(d['id']))

        /*
      
        if(d['y']>this.height){
         return this.height-25
        }else{
        return d['y'];
          }
              

      this.labels
        .attr('x', d => d['x'])
        .attr('y', d => d['y'])
      */
      })
      .restart();

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
