import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import * as data from '../../../assets/data/Key_Highlights_Ordered.json';

@Component({
  selector: 'app-key-highlights',
  templateUrl: './key-highlights.component.html',
  styleUrls: ['./key-highlights.component.css']
})
export class KeyHighlightsComponent implements OnInit {

  keyHighlights = [];
  @Input() private showHighlight: Array<any>;
  @Output() INKeyHighlight = new EventEmitter<{ key: String }>();
  @Output() OUTKeyHighlight = new EventEmitter<{}>();


  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.showHighlight) {
      // console.log('Highlihts Changed', this.showHighlight, this.showHighlight.length, this.keyHighlights.length);
    }
  }

  ngOnInit() {
    data['default'].forEach(d => {
      this.keyHighlights.push(d['KeyHighlight']);
    });
    //  console.log(this.keyHighlights);
  }

  getStyle(key) {
    if (this.showHighlight.includes(key)) {
      return {
        'background-color': '#62340F',
        'color': 'white'
      };
    } else {
      return '';
    }
  }

  getPeoplePlaces(key) {
    this.INKeyHighlight.emit({ key: key });
  }

  removePeoplePlaces() {
    this.OUTKeyHighlight.emit({});
  }

}

