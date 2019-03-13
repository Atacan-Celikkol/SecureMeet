import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { DataService } from './base.service';
import { SignalRService } from './signalr.service';

@NgModule({
  imports: [
    HttpClientModule
  ],
  exports: [
  ],
  declarations: [],
  providers: [DataService, SignalRService]
})
export class ServicesModule { }
