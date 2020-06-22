import { Component, OnInit } from '@angular/core';
import * as ArmyData from '../../assets/data/army.json';
import * as LabourData from '../../assets/data/labour.json';
import * as PeopleData from '../../assets/data/peopleww2.json';

@Component({
  selector: 'app-looted-human-resource',
  templateUrl: './looted-human-resource.component.html',
  styleUrls: ['./looted-human-resource.component.css']
})
export class LootedHumanResourceComponent implements OnInit {

  constructor() { }

  activeTopic = 'ARMY';


  armyPlaces = [];
  activeArmyPlace = '';
  activeArmyContent = {};
  armyImages = [];
  diedCount = 0;
  activeArmyCountries = [];

  labourPlaces = [];
  activeLabourPlace = '';
  activeLabourContent = {};
  labourImages = [];
  activeLabourCountries = [];

  peoplePlaces = [];
  activePeoplePlace = '';
  activePeopleState = '';
  activePeopleContent = {};
  peopleImages = [];



  ngOnInit() {
    // Set Default Army Place
    this.armyPlaces = Object.keys(ArmyData['default']);
    this.setActiveArmyContent(this.armyPlaces[0]);
    this.activeArmyPlace = this.armyPlaces[0];


    // Set Default Labour Place
    this.labourPlaces = Object.keys(LabourData['default']);
    this.setActiveLabourContent(this.labourPlaces[0]);
    this.activeLabourPlace = this.labourPlaces[0];

    // Set Default People Place
    this.peoplePlaces = Object.keys(PeopleData['default']);
    this.setActivePeopleContent(this.peoplePlaces[0]);
    this.activePeoplePlace = this.peoplePlaces[0];
  }


  isActiveTopic(topic) {
    return topic == this.activeTopic;
  }

  setActiveTopic(topic) {
    this.activeTopic = topic;
  }


  // Army 
  setActiveArmyContent(place) {
    this.activeArmyContent = ArmyData['default'][place];
    this.activeArmyPlace = place;
    // console.log(this.activeArmyContent);

    if (place == 'France' || place == 'Mesopotamia') {
      this.diedCount = 74000;

      this.activeArmyCountries = ['France', 'Mesopotamia'];

    } else {
      this.diedCount = 0;

      if (place == 'Europe' || place == 'German') {
        this.activeArmyCountries = ['Europe', 'German'];
      } else {
        this.activeArmyCountries = [place];
      }
    }
  }

  isActiveArmyPlace(place) {

    if (place == 'France' || place == 'Mesopotamia') {
      return this.activeArmyPlace == 'France' || this.activeArmyPlace == 'Mesopotamia';
    }

    if (place == 'Europe' || place == 'German') {
      return this.activeArmyPlace == 'Europe' || this.activeArmyPlace == 'German';
    }

    return place == this.activeArmyPlace;
  }

  setActiveArmyCountry(place) {
    this.activeArmyCountries = [place];
  }



  // Labour 
  setActiveLabourContent(place) {
    this.activeLabourContent = LabourData['default'][place];
    this.activeLabourPlace = place;

    //   console.log(this.activeLabourContent);

    this.activeLabourCountries = [place];
  }

  isActiveLabourPlace(place) {
    return place == this.activeLabourPlace;
  }

  getPeopleMigratedYear(place) {
    return LabourData['default'][place]['year'];
  }


  setActiveLabourCountry(place) {
    this.activeLabourCountries = [place];
  }


  // People
  setActivePeopleContent(place) {
    this.activePeopleContent = PeopleData['default'][place];
    this.activePeopleState = PeopleData['default'][place]['state'];
    this.activePeoplePlace = place;
    // console.log(this.activePeopleContent, this.activePeoplePlace);
  }

  isActivePeoplePlace(place) {
    return place == this.activePeoplePlace;
  }

  getPeopleDiedYear(place) {
    return PeopleData['default'][place]['year'];
  }

}
