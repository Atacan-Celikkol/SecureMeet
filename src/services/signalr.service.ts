
import { EventEmitter, Injectable } from '@angular/core';
// import { InnovaResponse } from '../models';
import 'signalr';
import { Observable, Subject } from 'rxjs';
import { environment } from '../environments/environment';
declare var $: any;
@Injectable()
export class SignalRService {

   private starting$: Subject<any> = new Subject<any>();
   onConnecting: Observable<any>;

   private connectionState$: Subject<any> = new Subject<any>();
   connectionState: Observable<any>;

   // Declare the variables
   public innovaProxy: any;
   private connection: any;

   // create the Event Emitter
   public innovaReceived$: EventEmitter<any>;
   public connectionExists: Boolean;

   constructor() {
      this.connectionState = this.connectionState$.asObservable();
      this.onConnecting = this.starting$.asObservable();
      // Constructor initialization
      this.innovaReceived$ = new EventEmitter<string>();
      this.connectionExists = false;

      if (!this.connection) {
         this.connection = $.hubConnection(environment.base_signalr_url
            // , { qs: 'BearerToken=' + localStorage.getItem(Keys.USER_TOKEN), logging: true }
         );
      }
      // create new proxy as name already given in top
      this.innovaProxy = this.connection.createHubProxy('innovahub');

      this.connection.stateChanged((state: any) => {
         this.connectionState$.next(state);
      });

      // register on server events
      this.registerOnServerEvents();
   }

   // public joinTicket(ticketId: string) {

   //    this.ticketProxy.invoke('JoinTicket', ticketId).done(function () {
   //       // console.log('Invocation of jointicket succeeded');
   //    }).fail(function (error) {
   //       // console.log('Invocation of jointicket failed. Error: ' + error);
   //    });

   // }

   public joinInnova() {

      this.innovaProxy.invoke('JoinTickets').done(function () {
         console.log('JoinInnova Succeeded');
      }).fail(function (error) {
         // console.log('Invocation of jointicket failed. Error: ' + error);
      });

   }


   // public leaveTicket(ticketId: string) {

   //    this.ticketProxy.invoke('LeaveTicket', ticketId).done(function () {
   //       // console.log('Invocation of LeaveTicket succeeded');
   //    }).fail(function (error) {
   //       // console.log('Invocation of LeaveTicket failed. Error: ' + error);
   //    });

   // }

   // check in the browser console for either signalr connected or not
   public start() {

      // if (localStorage.getItem(Keys.USER_TOKEN) != null) {
      //    $.signalR.ajaxDefaults.headers = {
      //       Authorization: "Bearer " + localStorage.getItem(Keys.USER_TOKEN)
      //    };
      this.connection.start()
         .done((data: any) => {
            // console.log('Now connected ' + data.transport.name + ', connection ID= ' + data.id);
            this.connectionExists = true;
            this.starting$.next(data);
         }).fail((error: any) => {
            this.starting$.error(error);
            this.connectionExists = false;
         });

      this.connection.error((error) => {
         this.connectionExists = false;
      });
      // } else {
      //    this.connection.stop();
      //    this.connectionExists = false;
      // }

   }

   private registerOnServerEvents(): void {
      this.innovaProxy.on('onAccept', (data = 'accept') => {
         this.innovaReceived$.emit(data);
      });

      this.innovaProxy.on('onReject', (data = 'reject') => {
         this.innovaReceived$.emit(data);
      });

      this.innovaProxy.on('onStop', (data = 'stop') => {
         this.innovaReceived$.emit(data);
      });
   }
}
