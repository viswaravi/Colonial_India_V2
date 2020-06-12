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
  }
}