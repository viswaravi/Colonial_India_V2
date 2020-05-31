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
import { PeoplesMapComponent } from './chartComponents/peoples-map/peoples-map.component';
import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';

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
    PeoplesMapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxPageScrollCoreModule.forRoot({duration: 1500})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
