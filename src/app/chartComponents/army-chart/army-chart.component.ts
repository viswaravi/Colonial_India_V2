import { Component, OnInit, ViewChild, Input, ElementRef, AfterViewInit, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';


@Component({
  selector: 'app-army-chart',
  templateUrl: './army-chart.component.html',
  styleUrls: ['./army-chart.component.css']
})
export class ArmyChartComponent implements OnInit, AfterViewInit {

  @ViewChild('armyChart', { static: false }) private chartContainer: ElementRef;
  @Input() private count: Number;
  @Input() private diedCount: Number;

  margin: any = { top: 0, bottom: 0, left: 0, right: 0 };
  chart: any;
  width: number;
  height: number;
  xScale: any;
  yScale: any;
  xAxis: any;
  yAxis: any;
  svg: any;
  svgIndex = 0;

  imgWidth: any;

  imageScale = d3.scaleLinear().domain([0, 1000000]).range([0, 225]);
  imageValues = []


  constructor() { }

  ngOnInit(): void {
    this.imgWidth = 30;
  }


  ngOnChanges(changes: SimpleChanges): void {

    this.count = Math.ceil(this.imageScale(this.count));
    this.diedCount = Math.floor(this.imageScale(this.diedCount));

    console.log('DEPLOYED :', this.count);
    console.log('DIED :', this.diedCount);

    this.updateCustomChart();
  }

  ngAfterViewInit() {
    this.createCustomChart();
    console.log('COUNT :', this.imageScale(this.count));
  }

  getPosY(index) {

    let y = 0;
    //  Nodes in a Row
    let NROW = 15;

    let t = index / NROW;
    y = parseInt(t.toString().split('.')[0]);

    // radius - 13 diameter - 26, add for spacing
    //   let ypos = ((NROW - 1 - y) * (this.imgWidth + 1));
    let ypos = ((y) * (this.imgWidth + 1));

    // console.log('YPOS: ', ypos);

    return ypos;
  }

  getPosX(index) {

    //  console.log('INDEX :', index);

    let NROW = 15;

    let rem = index % NROW;


    let rowNum = index / NROW;
    rowNum = parseInt(rowNum.toString().split('.')[0]);
    // if (rowNum % 2 == 0) {
    //   rem = NROW - rem - 1;
    // }

    let xpos = ((rem * (this.imgWidth + 10)));

    // console.log('XPOS: ', xpos);

    return xpos;
  }


  createCustomChart() {
    let element = this.chartContainer.nativeElement;
    //Need Space for Labels s0 subtract space required to get Heigh and Width of SVG
    this.width = 600;
    this.height = 500;
    this.svg = d3.select(element).append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    // chart plot area
    this.chart = this.svg.append('g')
      .attr('class', 'armyPeople')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    this.updateCustomChart();
  }

  getImgURL(name) {
    if (name.split('_')[1] == 'DEP') {
      return './../../../assets/images/SoldierAlive.png';
    } else {
      return './../../../assets/images/SoldiersDied.png';
    }
  }

  updateCustomChart() {

    this.svgIndex = 0;

    // Create Data Array
    this.imageValues = [];
    let index = 0;


    for (let i = 0; i < this.diedCount; i++, index++) {
      this.imageValues.push(index + '_DIE');
    }

    for (let i = 0; i < this.count; i++, index++) {
      this.imageValues.push(index + '_DEP');
    }


    // console.log('DATA :', this.imageValues);


    // let icons = this.svg.select('g').selectAll('.icon');

    //icons.remove();

    //  console.log(this.imageValues);

    let icons = this.svg.select('g').selectAll('.icon');


    // icons.remove();


    icons = this.svg.selectAll('.icon').data(this.imageValues, d => {
      return d;
    });

    icons.exit().remove();

    /*
    icons
      .enter()
      // .merge(icons)
      .append("image")
      .attr('class', 'icon')
      .attr('xlink:href', d => this.getImgURL(d))
      .attr('width', 30)
      .attr('height', 30)
     .attr("x", 600)
     .attr("y", 460)
      .transition()
      .delay(d => { return d.split('_')[0] * 10; })
      .duration(1000)
      .attr("x", d => { return this.getPosX(d.split('_')[0]) })
      .attr("y", d => { return this.getPosY(d.split('_')[0]) })
      .attr('xlink:href', d => this.getImgURL(d));
    */
    icons
      .enter()
      // .merge(icons)
      .append("image")
      .attr('class', 'icon')
      .attr('xlink:href', d => this.getImgURL(d))
      .attr('width', 30)
      .attr('height', 30)
      .attr('opacity', 0)
      .attr("x", d => { return this.getPosX(d.split('_')[0]) })
      .attr("y", d => { return this.getPosY(d.split('_')[0]) })
      .attr('xlink:href', d => this.getImgURL(d))
      .transition()
      .delay(d => { return d.split('_')[0] * 10; })
      .duration(1000)
      .attr('opacity', 1);

  }


}
