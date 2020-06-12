import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Input, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
import * as data from '../../../assets/data/countries.json';
import * as topojson from "topojson-client";
import * as highlights from '../../../assets/data/Highlights_2.json';
import * as placesLocations from '../../../assets/data/locations_filled.json';

@Component({
  selector: 'app-world-highlights',
  templateUrl: './world-highlights.component.html',
  styleUrls: ['./world-highlights.component.css']
})
export class WorldHighlightsComponent implements OnInit, AfterViewInit {

  @ViewChild('chart', { static: false }) private chartContainer: ElementRef;
  @Input() private placesToHighlight: Array<any>;
  margin: any = { top: 0, bottom: 0, left: -500, right: 0 };
  chart: any;
  width: number;
  height: number;
  xScale: any;
  yScale: any;
  xAxis: any;
  yAxis: any;
  svg: any;
  places = [];
  locFormat = [];
  circles: any;
  countryLocations = {};

  constructor() { }

  ngOnInit() {

    // console.log('Filled :', placesLocations['default']);

    highlights['default'].map((t) => {

      let p = t['Places'];
      let locs = [];
      if (p.split(',').length > 1) {
        locs = p.split(',');
        locs.map(loc => {
          this.addPlace(loc);
        });
      } else {
        this.addPlace(p);
      }

    });

    this.places.map(place => {
      this.locFormat.push({
        Place: place,
        lat: 0,
        lon: 0
      });
    });

    // console.log('Places :', JSON.stringify(this.locFormat));


  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.placesToHighlight) {
      // console.log('Places Changed :', this.placesToHighlight);
      this.updateCustomChart();
    }
  }



  addPlace(p) {
    if (p != "" && this.places.indexOf(p.trim()) == -1) {
      this.places.push(p.trim());
    }
  }


  ngAfterViewInit() {
    this.createCustomChart();
  }


  projection = d3.geoMercator().scale(180);
  pathGenerator = d3.geoPath().projection(this.projection);

  createCustomChart() {
    let element = this.chartContainer.nativeElement;

    this.width = 800;
    this.height = 400;
    this.svg = d3.select(element).append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    // chart plot area
    this.chart = this.svg.append('g')
      .attr('class', 'worldMap')

    const countries = topojson.feature(data['default'], data['default'].objects.countries);


    this.svg.selectAll('worldMap')
      .data(countries.features)
      .enter()
      .append('path')
      .attr('transform', `translate(${-150}, ${this.margin.top})`)
      .attr('stroke', 'black')
      .attr('fill', 'white')
      .attr('d', d => this.pathGenerator(d));
  }


  updateCustomChart() {

    this.svg.selectAll('.loc').remove();

    let aa = [-122.490402, 37.786453];
    let bb = [-122.389809, 37.72728];

    let aa_1 = [-122.490402, 37.786453];
    let bb_1 = [-122.389809, 37.72728];


    let locations = [];

    placesLocations['default'].map(locInfo => {
      if (this.placesToHighlight.includes(locInfo['Place'])) {
        aa = [locInfo['lon'], locInfo['lat']];
        bb = [locInfo['lon'], locInfo['lat']];

        locations.push(aa);
        locations.push(bb);

        this.countryLocations[aa.join(',')] = locInfo['Place'];

        // console.log('Place :', locInfo, aa, bb);
      }
    });


    let cIndex = 0;

    this.circles = this.svg.selectAll("circle")
      .data(locations)
      .enter()
      .append("circle")
      .attr('id', d => { return d; })
      .attr('class', 'loc')
      .attr("cx", (d) => { return this.projection(d)[0]; })
      .attr("cy", (d) => { return this.projection(d)[1]; })
      .attr('transform', `translate(${-150}, ${this.margin.top})`)
      .attr("r", "3px")
      .attr("fill", "#613207");




    this.circles.on('mouseover', () => {

    //  console.log(this.countryLocations);
    //  console.log(d3.event.target);

      let x = d3.event.target.cx.baseVal.value;
      let y = d3.event.target.cy.baseVal.value;

      // Name on Background
      this.svg.append('text')
        .attr('id', 'tempText')
        .attr('x', x)
        .attr('y', y)
        .attr('font-family', 'montserratBold')
        .attr('font-color', 'brown')
        .attr('transform', `translate(${-145}, ${this.margin.top})`)
        .attr('letter-spacing', 0.4)
        .text(d => { return this.countryLocations[d3.event.target.id] });
    });

    this.circles.on('mouseout', () => {
      this.svg.selectAll('#tempText').remove();
    });

  }



}
