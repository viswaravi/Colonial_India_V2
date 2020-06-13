import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Input, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
import * as data from '../../../assets/data/countriesSmall.json';
import * as topojson from "topojson-client";

@Component({
  selector: 'app-army-world-highlights',
  templateUrl: './army-world-highlights.component.html',
  styleUrls: ['./army-world-highlights.component.css']
})
export class ArmyWorldHighlightsComponent implements OnInit {

  @ViewChild('armyWorldChart', { static: false }) private chartContainer: ElementRef;
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


  cLocations = {
    "Tibet": [88.787865, 30.153360],
    "Europe": [15.255119, 54.525963],
    "Malta": [14.375416, 35.937496],
    "Malacca": [102.250084, 2.189594],
    "Malaya": [101.538116, 3.519863],
    "Burma": [21.9162, 96.199379],
    "Sudan": [32.529831, 15.564836],
    "Ethiopia": [40.489674, 9.145000],
    "Penang": [100.332680, 5.416393],
    "Mauritius": [57.552151, -20.348404],
    "Singapore": [103.819839, 1.352083],
    "Somaliland": [46.136112, 9.862669],
    "East Africa": [45.318161, 2.046934]
  };

  cCountries = Object.keys(this.cLocations);



  constructor() { }

  ngOnInit() {
  }


  ngOnChanges(changes: SimpleChanges) {
    //  if (changes.countriesToHighlight) {
    console.log('Places Changed :', this.countriesToHighlight);
    this.updateCustomChart();
    //  }
  }

  ngAfterViewInit() {
    this.createCustomChart();
  }


  projection = d3.geoMercator().scale(100);
  pathGenerator = d3.geoPath().projection(this.projection);



  updatePointLocation() {

    let cNames = [];
    this.countriesToHighlight.map(country => {
      cNames.push(country.trim());
    });

    console.log(cNames);


    this.svg.selectAll('#cCountry').remove();

    cNames.map(country => {
      if (this.cCountries.includes(country)) {
        console.log('Added :', country, this.cLocations[country]);
        this.circleLocation = this.svg.selectAll("circle")
          .data([this.cLocations[country]])
          .enter()
          .append("circle")
          .attr('id', 'cCountry')
          .attr('class', 'loc')
          .attr("cx", (d) => { return this.projection(d)[0]; })
          .attr("cy", (d) => { return this.projection(d)[1]; })
          .attr('transform', `translate(${-150}, ${this.margin.top})`)
          .attr("r", "10px")
          .attr("fill", "#613207");
      }
    });
  }


  createCustomChart() {
    let element = this.chartContainer.nativeElement;

    this.width = 590;
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
      .attr('transform', `translate(${-150}, ${this.margin.top})`)
      .attr('stroke', 'black')
      .attr('fill', 'white')
      .attr('d', d => this.pathGenerator(d));

    this.updateCustomChart();
  }


  getCountryColor(d) {
    // console.log(d.properties.name);

    if (this.countriesToHighlight.includes(d.properties.name)) {
      return '#613207';
    } else {
      return 'white';
    }
  }

  updateCustomChart() {
    this.svg.selectAll('worldMap')
      .data(this.countries['features'])
      .enter()
      .append('path')
      .attr('transform', `translate(${-150}, ${this.margin.top})`)
      .attr('stroke', 'black')
      .attr('fill', d => this.getCountryColor(d))
      .attr('d', d => this.pathGenerator(d));

    this.updatePointLocation();

    this.currentLocation = this.countriesToHighlight[0];
  }
}