import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minuteSeconds'
})
export class MinuteSecondsPipe implements PipeTransform {
  transform(value: number): string {
    let minutes: any = Math.floor(value / 60);
    if (minutes.toString().length === 1) {
      minutes = '0' + minutes;
    }
    let seconds: any = (value - minutes * 60);
    if(seconds.toString().length === 1) {
      seconds = '0' + seconds;
    }
    return minutes + ':' + seconds;
  }
}
