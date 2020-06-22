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
  @Input() private currentYearIndex: number;
  @Input() private chartState: any;
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
  lines: any;
  localGraphState = 'empty';
  resumeCount = 0;
  svg: any;
  line: any;

  // Pause and Resume Animation
  offsets = [];
  totalLength = [];
  durationvalue = 17000;


  dataColumns = ['GDP Growth Percent',
    'India GDP world contribution',
    'Percent of world population'
  ];

  xValues = ['1600', '1700', '1820', '1870', '1913', '1930', '1940', '1950', '1990', '2020'];
  yValues = ['0.00', '7.50', '15.00', '22.50', '30.00'];

  columnName: any;


  constructor() { }

  ngOnInit(): void {
    // console.log(data['default']);
  }

  ngOnChanges(changes: SimpleChanges): void {
    //  console.log('Changed State', this.chartState);
    //  console.log('Changed Year ', this.currentYearIndex);

   // console.log(this.currentYearIndex, this.xValues[this.currentYearIndex]);

    this.updateYearNames();
    if (this.chartState == 'goto') {
  //    console.log('GOTO GRAPH', this.currentYearIndex);
      this.localGraphState = 'goto';
      this.gotoChart();
    } else {

      // To Resume or play from GOTO to other State
      if (this.localGraphState == 'goto') {
        this.removeChartLines();
        this.createChartLines();
      }

      // If Starting Point Move the Dash Offset 
      if (this.currentYearIndex == 0) {
        this.clearChart();
        this.clearYearNames();
      //  console.log('RESET GRAPH');
        this.localGraphState = 'empty';
        this.resumeCount = 0;
      }

      if (this.chartState == 'pause') {
        this.pauseChart();
        this.localGraphState = 'pause';
     //   console.log('PAUSE GRAPH');
      } else if (this.chartState == 'play') {
        if (this.localGraphState == 'empty') {
          this.playChart();
          this.localGraphState = 'play';
       //   console.log('PLAY GRAPH');
        }
        if ((this.localGraphState == 'pause' || this.localGraphState == 'goto') && (this.currentYearIndex + 1) % 9 != 0) {
          // IF GRAPH IS PAUSED OR CURRENT YEAR NOT AT END, THEN RESUME
          this.resumeChart();
        //  console.log('RESUME GRAPH');
        }
      }
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

    this.svg = d3.select(element).append('svg')
      .attr('width', this.svgWidth)
      .attr('height', this.svgHeight);

    // console.log('Height', this.height);
    // console.log('Width', this.width);


    this.chart = this.svg.append('g')
      .attr('class', 'myCircles')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);


    // chart plot area
    this.chart = this.svg.append('g')
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
      this.svg
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
      this.svg
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
    this.line = d3.line()
      .curve(d3.curveLinear)
      .x(function (d: any) { return d.x })
      .y(function (d: any) { return d.y });

    // Draw Grid 
    let gridData = [];
    this.yValues.map(yValue => {
      gridData.push({ x: this.xScale('1600'), y: this.yScale(parseFloat(yValue)) });
      gridData.push({ x: this.xScale('2020') + 35, y: this.yScale(parseFloat(yValue)) });
    });

    //  console.log('Grid Data:', gridData);

    // Add Grid Lines
    for (let i = 0; i <= gridData.length - 2; i = i + 2) {
      this.svg.append('path')
        .attr('class', 'gridLine')
        .attr('d', this.line(gridData.slice(i, i + 2)))
        .attr('transform', `translate(${this.margin.left}, ${-this.margin.bottom - 5})`)
        .attr("stroke", "#594E47")
        .attr("stroke-width", 1)
        .attr("fill", "none");
    }

    // Add Bottom Grid Line
    this.svg.append('path')
      .attr('class', 'bottomGridLine')
      .attr('d', this.line(gridData.slice(0, 2)))
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
    // console.log('DataLines', this.dataLines);


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
      this.svg.append('path')
        .attr('class', 'dataLine')
        .attr('d', this.line(this.dataLines[col]))
        .attr('transform', `translate(${this.margin.left}, ${-this.margin.bottom - 5})`)
        .attr("stroke", this.getStrokeColor(col))
        .attr("stroke-width", 2)
        .attr('opacity', 1)
        .attr("fill", "none");
    });

    /*
    // Add Data Point Numbers in Graph
    data['default'].map(dt => {
      this.dataColumns.map(col => {
        // Name on Background
        this.svg.append('text')
          .attr('x', this.xScale(dt['Years']) - 10)
          .attr('y', this.yScale(dt[col]) - 10)
          .attr('font-family', 'montserratBold')
          .attr('fill', '#594e47')
          .attr('transform', `translate(${this.margin.left + 10}, ${-this.margin.bottom - 10})`)
          .attr('word-wrap', 'break-word')
          .attr('letter-spacing', 0.2)
          .attr('font-size', 12)
          .text(dt[col]);
      });
    });
    */
    this.updateYearNames();

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

  playChart() {
    /*
     let circles = d3.selectAll('.pointCircle').filter((d, i) => {
         console.log(d);
         return true;
     }).transition().duration(500).attr('r', 7);
     console.log('Circles', circles);
     //.transition().duration(500).attr("fill", d => {this.getStrokeColor(d)});
   */
    this.lines = d3.selectAll('.dataLine');

    this.totalLength = [this.lines['_groups'][0][0].getTotalLength(), this.lines['_groups'][0][1].getTotalLength(), this.lines['_groups'][0][2].getTotalLength()];

    // console.log(totalLength);

    let dValue = this.durationvalue;

    for (let i = 0; i < 3; i++) {
      d3.select(this.lines['_groups'][0][i])
        .attr("stroke-dasharray", this.totalLength[i])
        .attr("stroke-dashoffset", this.totalLength[i])
        .transition()
        .duration(dValue)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);
    }

  }

  pauseChart() {

   // console.log('Chart Pause');

    this.lines = d3.selectAll('.dataLine');

    // STORE CUURENT POSITION OF ANIMATION
    if (this.chartState != 'goto') {
      this.offsets = [d3.select(this.lines['_groups'][0][0]).attr('stroke-dashoffset'), d3.select(this.lines['_groups'][0][1]).attr('stroke-dashoffset'),
      d3.select(this.lines['_groups'][0][2]).attr('stroke-dashoffset')];
    }

    // console.log('Line Offsets :', this.offsets);

    // PAUSE ANIMATION
    for (let i = 0; i < 3; i++) {
      d3.select(this.lines['_groups'][0][i])
        .transition()
        .duration(0);
    }
  }

  resumeChart() {

   // console.log('chart resume', this.offsets);

    this.lines = d3.selectAll('.dataLine');

    this.resumeCount = this.resumeCount + 1;
    //redraw from current Duration,DashOffset and Length
    for (let i = 0; i < 3; i++) {
      // Caluculate Remaining Time from offsetvalue and Total Durartion
      let offsetCompleted = this.totalLength[i] - this.offsets[i];
      let durationPerMS = this.totalLength[i] / this.durationvalue;

      let offsetDurationRemaining = this.durationvalue - (offsetCompleted * durationPerMS);

      if (this.localGraphState == 'goto') {
        d3.select(this.lines['_groups'][0][i])
          .attr("stroke-dashoffset", this.totalLength[i] - this.offsets[i])
          .transition()
          .duration(offsetDurationRemaining - (1500 * this.resumeCount))
          .ease(d3.easeLinear)
          .attr("stroke-dashoffset", 0);
      } else {
        d3.select(this.lines['_groups'][0][i])
          .attr("stroke-dashoffset", this.offsets[i])
          .transition()
          .duration(offsetDurationRemaining - (1500 * this.resumeCount))
          .ease(d3.easeLinear)
          .attr("stroke-dashoffset", 0);

      }
    }

    this.localGraphState = 'play';
  }

  clearChart() {
    // clear Chart 
    // On Index Reset to 0
    this.lines = d3.selectAll('.dataLine');
    this.resumeCount = 0;

    let totalLength = [this.lines['_groups'][0][0].getTotalLength(), this.lines['_groups'][0][1].getTotalLength(), this.lines['_groups'][0][2].getTotalLength()];

    // console.log(totalLength);

    let durationvalue = 17000;

    d3.select(this.lines['_groups'][0][0])
      .attr("stroke-dasharray", this.totalLength[0])
      .attr("stroke-dashoffset", this.totalLength[0]);


    d3.select(this.lines['_groups'][0][1])
      .attr("stroke-dasharray", this.totalLength[1])
      .attr("stroke-dashoffset", this.totalLength[1]);

    d3.select(this.lines['_groups'][0][2])
      .attr("stroke-dasharray", this.totalLength[2])
      .attr("stroke-dashoffset", this.totalLength[2]);

  }

  removeChartLines() {
    d3.selectAll('.dataLine').remove();
  }

  createChartLines() {

    if (this.chartState == 'goto') {
      // Clear Data POints
      this.dataColumns.map(col => {
        this.dataLines[col] = [];
      });

      // Add Data Points upto selected Year
      data['default'].map((dt, index) => {
        if (index <= this.currentYearIndex) {
          this.dataColumns.map(col => {
            this.dataLines[col].push({ x: this.xScale(dt['Years']) + 10, y: this.yScale(dt[col]) });
          });
        }
      });
    } else {
      // Clear Data POints
      this.dataColumns.map(col => {
        this.dataLines[col] = [];
      });

      // Add Data Points upto selected Year
      data['default'].map((dt, index) => {
        this.dataColumns.map(col => {
          this.dataLines[col].push({ x: this.xScale(dt['Years']) + 10, y: this.yScale(dt[col]) });
        });
      });

      // Add SVG Lines for the Data
      this.dataColumns.map((col, i) => {
        this.svg.append('path')
          .attr('class', 'dataLine')
          .attr('d', this.line(this.dataLines[col]))
          .attr('transform', `translate(${this.margin.left}, ${-this.margin.bottom - 5})`)
          .attr("stroke", this.getStrokeColor(col))
          .attr("stroke-width", 2)
          .attr('opacity', 1)
          .attr("fill", "none");
      });


      this.lines = d3.selectAll('.dataLine');
      if (this.totalLength.length == 0) {
        this.totalLength = [this.lines['_groups'][0][0].getTotalLength(), this.lines['_groups'][0][1].getTotalLength(), this.lines['_groups'][0][2].getTotalLength()];
      }
    //  console.log('TL:', this.totalLength);
    //  console.log('OFF:', this.offsets);

      for (let i = 0; i < 3; i++) {
        d3.select(this.lines['_groups'][0][i])
          .attr("stroke-dasharray", this.totalLength[i])
          .attr("stroke-dashoffset", this.totalLength[i] - this.offsets[i]);
      }
    }

  }

  gotoChart() {

    this.pauseChart();
    this.removeChartLines();
    this.createChartLines();
    this.clearYearNames();
    this.updateYearNames();

    // Create Lines
    // Add SVG Lines for the Data
    this.dataColumns.map(col => {
      this.svg.append('path')
        .attr('class', 'dataLine')
        .attr('d', this.line(this.dataLines[col]))
        .attr('transform', `translate(${this.margin.left}, ${-this.margin.bottom - 5})`)
        .attr("stroke", this.getStrokeColor(col))
        .attr("stroke-width", 2)
        .attr('opacity', 1)
        .attr("fill", "none")
        ;
    });

    // STORE CUURENT POSITION OF ANIMATION
    this.lines = d3.selectAll('.dataLine');
    this.offsets = [this.lines['_groups'][0][0].getTotalLength(), this.lines['_groups'][0][1].getTotalLength(), this.lines['_groups'][0][2].getTotalLength()];

   // console.log('OFF SAVE:', this.offsets);
  }

  updateYearNames() {
    let yearData = [];
   // console.log(data['default']);
    data['default'].map((dt, index) => {
      if (index <= this.currentYearIndex) {
        yearData.push(dt);
       // console.log(dt, index);
      }
    });

   // console.log(yearData);

    yearData.map(dt => {
      this.dataColumns.map(col => {
        // Year value on Dots
        this.svg.append('text')
          .attr('x', this.xScale(dt['Years']) - 10)
          .attr('y', this.yScale(dt[col]) - 10)
          .attr('font-family', 'montserratBold')
          .attr('fill', '#594e47')
          .attr('class', 'yvalues')
          .attr('transform', `translate(${this.margin.left + 10}, ${-this.margin.bottom - 10})`)
          .attr('word-wrap', 'break-word')
          .attr('letter-spacing', 0.2)
          .attr('font-size', 12)
          .text(dt[col]);
      });
    });

  }


  clearYearNames() {
    d3.selectAll('.yvalues').remove();
  }

}