import { Component, ElementRef, OnInit, SimpleChanges, ViewChild, Input } from '@angular/core';
import * as d3 from 'd3';
import * as data from '../../../assets/data/GDP.json';

@Component({
  selector: 'app-economy-population',
  templateUrl: './economy-population.component.html',
  styleUrls: ['./economy-population.component.css']
})
export class EconomyPopulationComponent implements OnInit {


  @ViewChild('chart', { static: false }) private chartContainer: ElementRef;
  @Input() private currentYear: number;
  margin: any = { top: 0, bottom: 50, left: 50, right: 20 };
  chart: any;
  width: number;
  height: number;
  svgHeight: number;
  svgWidth: number;
  xScale: any;
  yScale: any;
  xAxis: any;
  yAxis: any;
  barBackground: any;
  columns = [];
  values = [];
  dataLines: {};

  dataColumns = ['GDP Growth Percent',
    'India GDP world contribution',
    'Percent of world population'
  ];

  xValues = ['1600', '1700', '1820', '1870', '1913', '1930', '1940', '1950', '1990', '2020'];
  yValues = ['0.00', '7.50', '15.00', '22.50', '30.00'];

  columnName: any;


  constructor() { }

  ngOnInit(): void {
    console.log(data['default']);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.currentYear) {
      console.log('Changed', this.xValues[this.currentYear]);
      this.updateCustomChart();
    }
  }

  ngAfterViewInit() {
    this.createCustomChart();
  }



  createCustomChart() {
    let element = this.chartContainer.nativeElement;
    //Need Space for Labels s0 subtract space required to get Heigh and Width of SVG

    this.svgHeight = 500;
    this.svgWidth = 600;

    this.width = this.svgWidth - this.margin.left - this.margin.right;
    this.height = this.svgHeight - this.margin.top - this.margin.bottom;

    let svg = d3.select(element).append('svg')
      .attr('width', this.svgWidth)
      .attr('height', this.svgHeight);

    console.log('Height', this.height);
    console.log('Width', this.width);


    this.chart = svg.append('g')
      .attr('class', 'myCircles')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);


    // chart plot area
    this.chart = svg.append('g')
      .attr('class', 'lines')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);



    // define X & Y domains
    let xDomain = this.xValues;
    let yDomain = [35, 0];


    // create scales
    this.xScale = d3.scaleBand().padding(0.1).domain(xDomain).rangeRound([0, this.width]);
    this.yScale = d3.scaleLinear().domain(yDomain).range([0, this.height]);

    // X-Axis Labels
    this.xValues.forEach(xValue => {
      svg
        .append('text')
        .attr('class', 'classValueLabel')
        .attr('transform', `translate( ${this.margin.left}, ${this.svgHeight - 10})`)
        .attr('x', d => this.xScale(xValue))
        .attr('y', 0)
        .attr('font-family', 'merriweatherBold')
        .attr('font-size', '12px')
        .text(xValue);
    });

    // Y-Axis Labels
    this.yValues.forEach(yValue => {
      svg
        .append('text')
        .attr('class', 'classValueLabel')
        .attr('transform', `translate(${0}, ${-this.margin.bottom})`)
        .attr('x', 0)
        .attr('y', d => this.yScale(parseFloat(yValue)))
        .attr('font-family', 'merriweatherBold')
        .attr('font-size', '12px')
        .text(yValue + '%');
    });


    // Line Builder
    let line = d3.line()
      .curve(d3.curveLinear)
      .x(function (d: any) { return d.x })
      .y(function (d: any) { return d.y });

    // Draw Grid 
    let gridData = [];
    this.yValues.map(yValue => {
      gridData.push({ x: this.xScale('1600'), y: this.yScale(parseFloat(yValue)) });
      gridData.push({ x: this.xScale('2020') + 35, y: this.yScale(parseFloat(yValue)) });
    });

    console.log('Grid Data:', gridData);

    // Add Grid Lines
    for (let i = 0; i <= gridData.length - 2; i = i + 2) {
      svg.append('path')
        .attr('class', 'gridLine')
        .attr('d', line(gridData.slice(i, i + 2)))
        .attr('transform', `translate(${this.margin.left}, ${-this.margin.bottom - 5})`)
        .attr("stroke", "#594E47")
        .attr("stroke-width", 1)
        .attr("fill", "none");
    }

    // Add Bottom Grid Line
    svg.append('path')
      .attr('class', 'bottomGridLine')
      .attr('d', line(gridData.slice(0, 2)))
      .attr('transform', `translate(${this.margin.left}, ${0})`)
      .attr("stroke", '#594E47')
      .attr("stroke-width", 4)
      .attr("fill", "none");



    // Create Data Points
    this.dataLines = {
      'GDP Growth Percent': [],
      'India GDP world contribution': [],
      'Percent of world population': []
    };


    // Add Data Points
    data['default'].map(dt => {
      this.dataColumns.map(col => {
        this.dataLines[col].push({ x: this.xScale(dt['Years']) + 10, y: this.yScale(dt[col]) });
      });
    });
    console.log('DataLines', this.dataLines);


    // Add Circle Points for Line Chart
    this.dataColumns.map(col => {
      this.chart.selectAll("myCircles")
        .data(this.dataLines[col])
        .enter()
        .append("circle")
        .attr('opacity', 1)
        .attr("fill", this.getStrokeColor(col))
        .attr('class', 'pointCircle')
        .attr('colName', col)
        .attr('transform', `translate(${0}, ${-this.margin.bottom - 5})`)
        .attr("stroke", this.getStrokeColor(col))
        .attr("stroke-width", 2)
        .attr("cx", d => { return d['x']; })
        .attr("cy", d => { return d['y']; })
        .attr("r", 9);
    });

    // Add SVG Lines for the Data
    this.dataColumns.map(col => {
      svg.append('path')
        .attr('class', 'gridLine')
        .attr('d', line(this.dataLines[col]))
        .attr('transform', `translate(${this.margin.left}, ${-this.margin.bottom - 5})`)
        .attr("stroke", this.getStrokeColor(col))
        .attr("stroke-width", 2)
        .attr('opacity',1)
        .attr("fill", "none");
    });





  }



  getStrokeColor(colName) {
    if (colName == 'GDP Growth Percent') {
      return '#D0021B';
    }
    if (colName == 'India GDP world contribution') {
      return '#613207';
    }
    if (colName == 'Percent of world population') {
      return '#CCB33D';
    }
  }

  updateCustomChart() {
    /*
     let circles = d3.selectAll('.pointCircle').filter((d, i) => {
         console.log(d);
         return true;
     }).transition().duration(500).attr('r', 7);
     console.log('Circles', circles);
     //.transition().duration(500).attr("fill", d => {this.getStrokeColor(d)});
   */
  }

}