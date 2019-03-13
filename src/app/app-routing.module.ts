import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CallingComponent } from './calling/calling.component';
import { HomeComponent } from './home/home.component';
import { MeetingComponent } from './meeting/meeting.component';

const routes: Routes = [
   { path: 'home', component: HomeComponent },
   { path: 'voice-call/:id', component: CallingComponent },
   { path: 'video-call/:id', component: CallingComponent },
   { path: 'voice-call/:id/meeting', component: MeetingComponent },
   { path: 'video-call/:id/meeting', component: MeetingComponent },

   { path: '*', redirectTo: '/home', pathMatch: 'full' },
   { path: '**', redirectTo: '/home', pathMatch: 'full' }
];


@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [RouterModule]
})

export class AppRoutingModule { }


