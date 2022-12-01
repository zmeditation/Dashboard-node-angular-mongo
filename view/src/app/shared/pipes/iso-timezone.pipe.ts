import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'isoTimeZ' })
export class IsoTimeZonePipe implements PipeTransform {
  transform(inputDate: Date) {
    if (!(inputDate instanceof Date)) { inputDate = new Date(inputDate); } 
    

    return inputDate.toISOString();
  }
}
