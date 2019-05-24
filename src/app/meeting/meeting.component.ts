import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { SignalRService } from '../../services/signalr.service';
import { DataService } from '../../services/base.service';
declare var JitsiMeetExternalAPI: any;
declare var $: any;

@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.css']
})
export class MeetingComponent implements OnInit, OnDestroy {

  userName;
  meetingType;

  interval;
  remainingTime = 600;
  signalRSubscription: any;
  isVoiceCall = false;

  status = {
    stop: 'stop'
  };

  public notificationOptions = {
    position: ['top', 'right'],
    timeOut: 60000,
    clickToClose: true,
    showProgressBar: false
  };

  constructor(
    private router: Router,
    activatedRoute: ActivatedRoute,
    protected signalRService: SignalRService,
    protected _notf: NotificationsService,
    protected dataService: DataService<any, any>
  ) {
    activatedRoute.url.subscribe(x => {
      this.meetingType = x[0].path;
      if (this.meetingType === 'voice-call') {
        this.isVoiceCall = true;
      }
    });
    activatedRoute.params.subscribe(x => {
      this.userName = x.id;
    });
    setTimeout(() => {
      const domain = 'meet.jit.si';
      const interfaceConfigOverwrite = {
        SHOW_WATERMARK_FOR_GUESTS: false,
        SHOW_JITSI_WATERMARK: false,
        SHOW_BRAND_WATERMARK: false,
        filmStripOnly: false,
        VERTICAL_FILMSTRIP: false,
        DISPLAY_WELCOME_PAGE_CONTENT: false,
        VIDEO_QUALITY_LABEL_DISABLED: true,
        CLOSE_PAGE_GUEST_HINT: true,
        RECENT_LIST_ENABLED: false,
        TOOLBAR_BUTTONS: [''],
        SETTINGS_SECTIONS: [''],
        DEFAULT_LOCAL_DISPLAY_NAME: '',
      };
      const options = {
        width: '100%',
        height: '100%',
        roomName: 'ovidos-cezaevi-test',
        filmStripOnly: true,

        parentNode: document.querySelector('.video-chat-wrapper'),
        interfaceConfigOverwrite: interfaceConfigOverwrite
      };
      const api = new JitsiMeetExternalAPI(domain, options);
      if (this.isVoiceCall) {
        api.executeCommand('toggleVideo');
      }
      api.executeCommand('displayName', '');
      api.executeCommand('avatarUrl', '');
      api.addEventListener('videoConferenceLeft', event => {

      });
    }, 500);
  }

  ngOnInit() {
    this.countDown();

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
      if (response === this.status.stop) {
        this._notf.error('Aramanız sonlandırıldı.', null, { 'position': ['top', 'right'] });
        this.leave();
      }
    });
  }

  post() {
    this.dataService.post('common/innova-stop-push', null).subscribe();
    this.leave();
  }

  ngOnDestroy() {
    clearTimeout(this.interval);
    this.signalRSubscription.unsubscribe();
  }

  leave() {
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
  }

  countDown() {
    this.interval = setInterval(() => {
      this.remainingTime--;
      if (this.remainingTime === 60) {
        this._notf.alert('Görüşmenizin bitmesine 1 dakikadan kısa bir süre kaldı.');
      }
      if (this.remainingTime <= 0) {
        clearTimeout(this.interval);
        this.post();
      }
    }, 1000);
  }

}
