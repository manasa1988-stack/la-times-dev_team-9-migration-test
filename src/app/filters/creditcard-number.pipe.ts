import { Pipe } from '@angular/core';

@Pipe({
  name: 'creditcardnumber'
})
export class CreditCardNumberPipe {
  transform(val : string) {
    if (val && val.length > 0) {
      var mask : string="";
      for(var i=0; i<val.length-4;i++){
      mask=mask.concat("●");
      }
      return mask.concat(val.substring(val.length-4, val.length));
    } else {
      return val;
    }
  }
}
