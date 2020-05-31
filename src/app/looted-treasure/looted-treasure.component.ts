import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-looted-treasure',
  templateUrl: './looted-treasure.component.html',
  styleUrls: ['./looted-treasure.component.css']
})
export class LootedTreasureComponent implements OnInit {

  constructor() { }

  currentTreasureName:String = 'money';

  ngOnInit(): void {
  }

  shouldDisp(treasureName:String) {
    if (treasureName == this.currentTreasureName) {
      return true;
    } else {
      return false;
    }
  }


  setTreasureName(name:String){
    this.currentTreasureName = name;
  }


}
