import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import * as data from '../../../assets/data/key_Highlights.json';

@Component({
  selector: 'app-key-highlights',
  templateUrl: './key-highlights.component.html',
  styleUrls: ['./key-highlights.component.css']
})
export class KeyHighlightsComponent implements OnInit {

  keyHighlights = [];
  @Input() private showHighlight: Array<any>;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.showHighlight) {
      console.log('Highlihts Changed', this.showHighlight, this.showHighlight.length, this.keyHighlights.length);
    }
  }

  ngOnInit() {
    data['default'].forEach(d => {
      this.keyHighlights.push(d['KeyHighlight']);
    });
    console.log(this.keyHighlights);
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


}

