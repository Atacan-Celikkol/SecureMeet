import { Component, OnInit } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { DataService } from '../../services/base.service';
import { ActivatedRoute } from '@angular/router';
import { MeetingTypes } from '../../enums/MeetingTypes';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  meetingType: string;
  meetingTypes = MeetingTypes;

  constructor(
    public _notf: NotificationsService,
    protected dataService: DataService<any, any>,
    activatedRoute: ActivatedRoute
  ) {
    activatedRoute.queryParams.subscribe(x => {
      this.meetingType = this.meetingTypes[x['type']];
    });
  }

  logOut() {
    parent.postMessage('exit', '*');
  }

  post(isVoiceCall: boolean) {
    if (isVoiceCall) {
      this.dataService.post('common/innova-voice', null).subscribe();
    } else {
      this.dataService.post('common/innova', null).subscribe();
    }
  }
}
