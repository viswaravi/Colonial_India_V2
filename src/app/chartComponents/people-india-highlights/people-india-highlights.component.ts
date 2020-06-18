import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Input, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
import * as data from '../../../assets/data/india-states-off.json';
import * as topojson from "topojson-client";

@Component({
  selector: 'app-people-india-highlights',
  templateUrl: './people-india-highlights.component.html',
  styleUrls: ['./people-india-highlights.component.css']
})
export class PeopleIndiaHighlightsComponent implements OnInit {
  @ViewChild('indiaWorldChart', { static: false }) private chartContainer: ElementRef;
  @Input() private statesToHighlight: any;
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
  states = [];
  projection: any;
  pathGenerator: any;

  locations = [[71.560135, 34.025917]];


  constructor() { }

  ngOnInit() {
    this.width = 490;
    this.height = 580;

    this.projection = d3.geoMercator().center([83, 23]).scale(800).translate([this.width / 2, this.height / 2]);
    this.pathGenerator = d3.geoPath().projection(this.projection);

  }


  ngOnChanges(changes: SimpleChanges) {
    //  if (changes.countriesToHighlight) {
    console.log('Places Changed :', this.statesToHighlight);
    this.updateCustomChart();
    //  }
  }

  ngAfterViewInit() {
    this.createCustomChart();
  }


  createCustomChart() {
    let element = this.chartContainer.nativeElement;

    this.svg = d3.select(element).append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    // chart plot area
    this.chart = this.svg.append('g')
      .attr('class', 'indiaMap')

    this.states = topojson.feature(data['default'], data['default'].objects['ne_10m_admin_1_India_Official']);

    console.log('states:', this.states);

    this.svg.selectAll('indiaMap')
      .data(this.states['features'])
      .enter()
      .append('path')
      .attr('stroke', 'black')
      .attr('fill', 'white')
      .attr('d', d => this.pathGenerator(d));

    this.updateCustomChart();
  }


  getStateColor(d) {

    let sNames = this.statesToHighlight.split(',');

    if (sNames.includes(d.properties.name) || sNames.includes('All')) {
      return '#613207';
    } else {
      return 'white';
    }
  }

  updateCustomChart() {
    this.svg.selectAll('indiaMap')
      .data(this.states['features'])
      .enter()
      .append('path')
      .attr('stroke', 'black')
      .attr('fill', d => this.getStateColor(d))
      .attr('d', d => this.pathGenerator(d));


    let sNames = this.statesToHighlight.split(',');

    if (sNames.includes('Pakistan')) {
      this.svg.selectAll("circle")
        .data(this.locations)
        .enter()
        .append("circle")
        .attr('id', 'Pakistan')
        .attr('class', 'loc')
        .attr("cx", (d) => { return this.projection(d)[0]; })
        .attr("cy", (d) => { return this.projection(d)[1]; })
        .attr("r", "6px")
        .attr("fill", "#613207");

    } else {
      this.svg.selectAll('#Pakistan').remove();
    }

  }



}