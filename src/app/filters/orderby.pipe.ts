import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
 name: 'orderbypipe'
})
export class OrderByPipe implements PipeTransform{

 transform(array: Array<Date>): Array<Date> {
  if(!array || array === undefined || array.length === 0) return null;
  array.forEach(d => d.setHours(0,0,0,0)); 
    array.sort((a: any, b: any) => {
      if (a < b) {
        return -1;
      } else if (a > b) {
        return 1;
      } else {
        return 0;
      }
    });
    return array;
  }

}