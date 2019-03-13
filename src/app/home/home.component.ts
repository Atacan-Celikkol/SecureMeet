import { Component, OnInit } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { DataService } from '../../services/base.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(
    public _notf: NotificationsService,
    protected dataService: DataService<any, any>
  ) { }

  logOut() {
    parent.postMessage('exit', '*');
  }

  post(voiceCall = false) {
    if (voiceCall) {
      this.dataService.post('common/innova-voice', null).subscribe();
    } else {
      this.dataService.post('common/innova', null).subscribe();
    }
  }
}
