import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Input, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
import * as data from '../../../assets/data/countriesSmall.json';
import * as topojson from "topojson-client";

@Component({
  selector: 'app-labour-world-highlights',
  templateUrl: './labour-world-highlights.component.html',
  styleUrls: ['./labour-world-highlights.component.css']
})
export class LabourWorldHighlightsComponent implements OnInit {
  @ViewChild('labourWorldChart', { static: false }) private chartContainer: ElementRef;
  @Input() private countriesToHighlight: Array<any>;
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
  countries = [];
  currentLocation = '';
  circleLocation: any;

  constructor() { }

  ngOnInit() {
  }


  cLocations = {
    "Penang": [100.456238, 5.285153],
    "Mauritius": [57.552151, -20.348404],
    "Fiji": [178.065033, -17.713371],
    "Singapore": [103.819839, 1.352083],
    "Caribbean island of St. Croix": [-64.703201, 17.746639],
    "South Africa":[28.034088,-26.195246]
  };

  cCountries = Object.keys(this.cLocations);


  ngOnChanges(changes: SimpleChanges) {
    //  if (changes.countriesToHighlight) {
    //  console.log('Places Changed :', this.countriesToHighlight);
    this.updateCustomChart();
    //  }
  }

  ngAfterViewInit() {
    this.createCustomChart();
  }


  projection = d3.geoMercator().scale(100);
  pathGenerator = d3.geoPath().projection(this.projection);

  createCustomChart() {
    let element = this.chartContainer.nativeElement;

    this.width = 633;
    this.height = 400;
    this.svg = d3.select(element).append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    // chart plot area
    this.chart = this.svg.append('g')
      .attr('class', 'worldMap')

    this.countries = topojson.feature(data['default'], data['default'].objects.countries);

    this.svg.selectAll('worldMap')
      .data(this.countries['features'])
      .enter()
      .append('path')
      .attr('transform', `translate(${-165}, ${this.margin.top})`)
      .attr('stroke', 'black')
      .attr('fill', 'white')
      .attr('d', d => this.pathGenerator(d));

    this.updateCustomChart();
  }

  updatePointLocation() {

    let cNames = [];
    this.countriesToHighlight.map(country => {
      cNames.push(country.trim());
    });

  //  console.log(cNames);

    
    this.svg.selectAll('#cCountry').remove();

    cNames.map(country => {
      if (this.cCountries.includes(country)) {
       // console.log('Added :', country, this.cLocations[country]);
        this.circleLocation = this.svg.selectAll("circle")
          .data([this.cLocations[country]])
          .enter()
          .append("circle")
          .attr('id', 'cCountry')
          .attr('class', 'loc')
          .attr("cx", (d) => { return this.projection(d)[0]; })
          .attr("cy", (d) => { return this.projection(d)[1]; })
          .attr('transform', `translate(${-165}, ${this.margin.top})`)
          .attr("r", "10px")
          .attr("fill", "#613207");
      }
    });
  }


  getCountryColor(d) {
    // console.log(d.properties.name);

    let cNames = [];
    this.countriesToHighlight.map(country => {
      cNames.push(country.trim());
    });

  //  console.log(cNames);

    if (cNames.includes(d.properties.name.trim())) {
      return '#613207';
    } else {
      return 'white';
    }
  }

  updateCustomChart() {

    this.svg.select('g').selectAll('worldMap')
      .data(this.countries['features'])
      .enter()
      .append('path')
      .attr('transform', `translate(${-165}, ${this.margin.top})`)
      .attr('stroke', 'black')
      .attr('fill', d => this.getCountryColor(d))
      .attr('d', d => this.pathGenerator(d));


    this.updatePointLocation();

    this.currentLocation = this.countriesToHighlight[0];

  }



}