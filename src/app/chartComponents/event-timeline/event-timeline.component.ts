import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import * as d3 from 'd3';


@Component({
  selector: 'app-event-timeline',
  templateUrl: './event-timeline.component.html',
  styleUrls: ['./event-timeline.component.css']
})
export class EventTimelineComponent implements OnInit {

  @ViewChild('chart', { static: false }) private chartContainer: ElementRef;
  @Output() changeTime = new EventEmitter<{ fromYear: Number, toYear: Number }>();

  margin: any = { top: 15, bottom: 0, left: 50, right: 0 };
  chart: any;
  width: number;
  height: number;
  xScale: any;
  yScale: any;
  xAxis: any;
  yAxis: any;
  brush: any;
  gBrush: any;
  brushHandle: any;
  SYScale: any;
  timeLine: any;

  constructor() { }

  ngOnInit(): void {
  }


  ngAfterViewInit() {
    this.createCustomChart();
  }


  createCustomChart() {

    let element = this.chartContainer.nativeElement;
    //Need Space for Labels s0 subtract space required to get Heigh and Width of SVG
    this.width = 150;
    this.height = 640;
    let svg = d3.select(element).append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    // chart plot area
    this.chart = svg.append('g')
      .attr('class', 'timeLine')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    let yDomain = [1600, 1950];
    this.yScale = d3.scaleLinear().domain(yDomain).range([0, 610]);
    this.SYScale = d3.scaleLinear().domain(yDomain).range([0, 610]);

    this.yAxis = svg.append('g')
      .attr('class', 'axis axis-y')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
      .call(d3.axisLeft(this.yScale).tickSize(0))
      .attr('font-family', 'merriweatherBold')
      .attr('font-size', '16px')
      .call(g => g.select(".domain").remove());

    // Set Brush Region
    this.brush = d3.brushY().extent([[60, 0], [70, this.height - 25]]).on('start brush end', () => this.brushMoved());

    this.gBrush = svg
      .append("g")
      .attr("class", "brush")
      .call(this.brush)
      .call(g => g.select(".selection").attr('fill', '#2B4460').attr('fill-opacity', 1)); // SelectionRegion Styling


    // Add Square Brush Handles
    this.brushHandle = this.gBrush.selectAll(".handle--custom")
      .data([{ type: "n" }, { type: "s" }])
      .enter().append('rect')
      .attr('class', 'barBack')
      .attr('width', 30)
      .attr('stroke', '#D9CCB9')
      .attr('stroke-width', 3)
      .attr('height', 20)
      .attr('rx', 5)
      .attr('ry', 5)
      .style('fill', '#2B4460');
    this.gBrush.call(this.brush.move, [1600, 1950].map(this.yScale));

  }


  brushMoved() {
    let extent = d3.event.selection;
    if (extent == null) {
      // this.brushHandle.attr("display", "none");
      this.yScale.domain([1600, 1950]);
      this.yAxis.transition().duration(1000).call(d3.axisLeft(this.yScale).tickSize(0));

    } else {
      // console.log(extent[0], extent[1]);

      let fromYear = Math.round(this.SYScale.invert(extent[0]));
      let toYear = Math.round(this.SYScale.invert(extent[1]))

      //Change to New Domain
      this.yScale.domain([fromYear, toYear]);
      this.yAxis.transition().duration(1000).call(d3.axisLeft(this.yScale).tickSize(0));

      // To Remove Domain Line on Y-Axis
      this.yAxis.select('.domain').attr('stroke-width', 0);

      extent[0] = extent[0] + 2;
      this.brushHandle.attr("display", null).attr("transform", function (d, i) { return "translate(" + 50 + "," + extent[i] + ")"; });

      if (d3.event.type == 'end') {
        this.changeTime.emit({ fromYear: fromYear, toYear: toYear });
      }
    }
  }



}
