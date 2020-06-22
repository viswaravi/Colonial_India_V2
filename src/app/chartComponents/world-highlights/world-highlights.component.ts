import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import * as d3 from 'd3';
import * as data from '../../../assets/data/countriesSmall.json';
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
  @Input() private zoomLevel: any;
  @Output() INplaceHighlight = new EventEmitter<{ place: String }>();
  @Output() OUTplaceHighlight = new EventEmitter<{}>();

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

  d3zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on('zoom', this.zoomed);


  zoomed() {
    d3.selectAll('path').attr('transform', d3.event.transform);
    d3.selectAll('.loc').attr('transform', d3.event.transform);
    d3.selectAll('#tempText').attr('transform', d3.event.transform);
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.placesToHighlight) {
      // console.log('Places Changed :', this.placesToHighlight);
      this.updateCustomChart();
    }

    if (changes.zoomLevel) {
      this.clearMap();
      this.createCustomChart();
      this.updateCustomChart();
    }

  }


  clearMap() {
    this.svg.remove();
    // this.svg.select('.worldMap').remove();
    // d3.selectAll('.loc').remove();
  }


  addPlace(p) {
    if (p != "" && this.places.indexOf(p.trim()) == -1) {
      this.places.push(p.trim());
    }
  }


  ngAfterViewInit() {
    this.createCustomChart();
  }


  // projection = d3.geoMercator().scale(180);
  // pathGenerator = d3.geoPath().projection(this.projection);

  createCustomChart() {

    let projection = d3.geoMercator().scale(this.zoomLevel);
    let pathGenerator = d3.geoPath().projection(projection);

    let element = this.chartContainer.nativeElement;

    this.width = 766;
    this.height = 400;
    this.svg = d3.select(element).append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .call(this.d3zoom);

    // chart plot area
    this.chart = this.svg.append('g')
      .attr('class', 'worldMap')

    const countries = topojson.feature(data['default'], data['default'].objects.countries);


    this.svg.selectAll('worldMap')
      .data(countries.features)
      .enter()
      .append('path')
      .attr('class', 'map')
      .attr('transform', `translate(${-150}, ${this.margin.top})`)
      .attr('stroke', 'black')
      .attr('fill', 'white')
      .attr('d', d => pathGenerator(d));

  }


  updateCustomChart() {

    let projection = d3.geoMercator().scale(this.zoomLevel);
    let pathGenerator = d3.geoPath().projection(projection);

    this.svg.selectAll('.loc').remove();

    let aa = [-122.490402, 37.786453];
    let bb = [-122.389809, 37.72728];

    let aa_1 = [-122.490402, 37.786453];
    let bb_1 = [-122.389809, 37.72728];


    let locations = [];

    placesLocations['default'].map(locInfo => {

      if (this.placesToHighlight.includes(locInfo['Place'])) {

        //      console.log('Places:', locInfo['Place']);

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
      .attr("cx", (d) => { return projection(d)[0]; })
      .attr("cy", (d) => { return projection(d)[1]; })
      .attr('transform', `translate(${-150}, ${this.margin.top})`)
      .attr("r", "3px")
      .attr("fill", "#613207");




    this.circles.on('mouseover', () => {

      //  console.log(this.countryLocations);
      //  console.log(d3.event.target);
      this.INplaceHighlight.emit({ place: this.countryLocations[d3.event.target.id] });

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
      this.OUTplaceHighlight.emit({});
    });

  }



}
