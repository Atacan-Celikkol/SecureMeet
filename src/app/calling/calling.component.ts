import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { SignalRService } from '../../services/signalr.service';
import { NotificationsService } from 'angular2-notifications';
import { DataService } from '../../services/base.service';

@Component({
  selector: 'app-calling',
  templateUrl: './calling.component.html',
  styleUrls: ['./calling.component.css']
})
export class CallingComponent implements OnInit, OnDestroy {

  userName;
  meetingType;
  signalRSubscription: any;
  routingUrl: string;

  status = {
    accept: 'accept',
    reject: 'reject'
  };

  constructor(
    protected signalRService: SignalRService,
    activatedRoute: ActivatedRoute,
    protected router: Router,
    protected _notf: NotificationsService,
    protected dataService: DataService<any, any>
  ) {
    activatedRoute.url.subscribe(x => {
      this.routingUrl = `${x[0].path}/${x[1].path}/meeting`;
      this.meetingType = x[0].path;
    });
    activatedRoute.params.subscribe(x => {
      this.userName = x.id;
    });
  }

  ngOnInit() {
    if (!this.signalRService.connectionExists) {
      this.signalRService.start();
    } else {
      this.signalRService.joinInnova();
    }

    this.signalRService.connectionState.subscribe(t => {
      if (t.newState === 1) {
        this.signalRService.joinInnova();
      }

      if (t.newState === 4) {
        this.signalRService.start();
      }
    });

    this.signalRSubscription = this.signalRService.innovaReceived$.subscribe((response: string) => {
      if (response === this.status.accept) {
        this.router.navigate([this.routingUrl]);
      }
      if (response === this.status.reject) {
        this._notf.error('Aramanız reddedildi.', null, { 'position': ['top', 'right'] });
        this.router.navigate(['home']);
      }
    });
  }

  ngOnDestroy() {
    this.signalRSubscription.unsubscribe();
  }

  post() {
    this.dataService.post('common/innova-stop-push', null).subscribe(() => {
      if (this.userName === 'Doktor') {
        this.router.navigate(['home'], { queryParams: { type: 2 } });
        return;
      }
      if (this.meetingType === 'video-call') {
        this.router.navigate(['home'], { queryParams: { type: 1 } });
        return;
      }
      if (this.meetingType === 'voice-call') {
        this.router.navigate(['home'], { queryParams: { type: 0 } });
        return;
      }
    });
  }
}
