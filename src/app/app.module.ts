import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeadComponent } from './head/head.component';
import { IntroComponent } from './intro/intro.component';
import { LootedTreasureComponent } from './looted-treasure/looted-treasure.component';
import { ImpactComponent } from './impact/impact.component';
import { LootedHumanResourceComponent } from './looted-human-resource/looted-human-resource.component';
import { TailComponent } from './tail/tail.component';
import { PlacesEventsComponent } from './places-events/places-events.component';
import { EconomyPopulationComponent } from './chartComponents/economy-population/economy-population.component';
import { EventTimelineComponent } from './chartComponents/event-timeline/event-timeline.component';
import { KeyHighlightsComponent } from './chartComponents/key-highlights/key-highlights.component';
import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';
import { PeoplesMapBoxedComponent } from './chartComponents/people-map-boxed/peoples-map.component';
import { WorldHighlightsComponent } from './chartComponents/world-highlights/world-highlights.component';
import { ArmyChartComponent } from './chartComponents/army-chart/army-chart.component';
import { LabourChartComponent } from './chartComponents/labour-chart/labour-chart.component';
import { PeopleChartComponent } from './chartComponents/people-chart/people-chart.component';
import { ArmyWorldHighlightsComponent } from './chartComponents/army-world-highlights/army-world-highlights.component';
import { LabourWorldHighlightsComponent } from './chartComponents/labour-world-highlights/labour-world-highlights.component';
import { PeopleIndiaHighlightsComponent } from './chartComponents/people-india-highlights/people-india-highlights.component';
import { InViewportModule } from 'ng-in-viewport';
import { RulersComponent } from './chartComponents/rulers/rulers.component';
import { RulersContributionComponent } from './rulers-contribution/rulers-contribution.component';
import { HistoricalEventsComponent } from './chartComponents/historical-events/historical-events.component';

@NgModule({
  declarations: [
    AppComponent,
    HeadComponent,
    IntroComponent,
    LootedTreasureComponent,
    ImpactComponent,
    LootedHumanResourceComponent,
    TailComponent,
    PlacesEventsComponent,
    EconomyPopulationComponent,
    EventTimelineComponent,
    KeyHighlightsComponent,
    PeoplesMapBoxedComponent,
    WorldHighlightsComponent,
    ArmyChartComponent,
    LabourChartComponent,
    PeopleChartComponent,
    ArmyWorldHighlightsComponent,
    LabourWorldHighlightsComponent,
    PeopleIndiaHighlightsComponent,
    RulersComponent,
    RulersContributionComponent,
    HistoricalEventsComponent
  ],
  imports: [
    BrowserModule,
    InViewportModule,
    AppRoutingModule,
    NgxPageScrollCoreModule.forRoot({ duration: 1500 }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
