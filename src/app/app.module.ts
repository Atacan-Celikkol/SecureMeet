import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { CallingComponent } from './calling/calling.component';
import { MeetingComponent } from './meeting/meeting.component';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SimpleNotificationsModule, NotificationsService } from 'angular2-notifications';
import { PipesModule } from '../pipes/pipes.module';
import { ServicesModule } from '../services/services.module';
import { DataService } from '../services/base.service';

@NgModule({
  declarations: [
    AppComponent,
    CallingComponent,
    MeetingComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SimpleNotificationsModule.forRoot(),
    PipesModule,
    ServicesModule
  ],
  providers: [NotificationsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
