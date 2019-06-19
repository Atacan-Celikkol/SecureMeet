import { Component } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { DataService } from '../../services/base.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MeetingTypes } from '../../enums/MeetingTypes';
import { isNullOrUndefined } from 'util';

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
    router: Router,
    activatedRoute: ActivatedRoute
  ) {
    activatedRoute.queryParams.subscribe(x => {
      if (isNullOrUndefined(x['type']) || x['type'] > 2 || x['type'] < 0 ) {
        router.navigate(['home'], { queryParams: { type: 1 } });
      } else {
        this.meetingType = this.meetingTypes[x['type']];
      }
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
