import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'relativeTime' })
export class RelativeTimePipe implements PipeTransform {
  transform(value: Date) {
    if (!(value instanceof Date)) { value = new Date(value); } 
    

    const seconds: number = Math.floor((new Date().getTime() - value.getTime()) / 1000);
    const oneYear = 3.154e7;
    const oneMonth = 2.628e6;
    const oneDay = 86400;
    const oneHour = 3600;
    const oneMinute = 60;

    let interval: number = Math.floor(seconds / oneYear);

    if (interval >= 1) { return interval + ' years ago'; } 
    

    interval = Math.floor(seconds / oneMonth);
    if (interval >= 1) { return interval + ' months ago'; } 
    

    interval = Math.floor(seconds / oneDay);
    if (interval >= 1) { return interval + ' days ago'; } 
    

    interval = Math.floor(seconds / oneHour);
    if (interval >= 1) { return interval + ' hours ago'; } 
    

    interval = Math.floor(seconds / oneMinute);
    if (interval >= 1) { return interval + ' minutes ago'; } 
    
    return Math.floor(seconds) + ' seconds ago';
  }
}
