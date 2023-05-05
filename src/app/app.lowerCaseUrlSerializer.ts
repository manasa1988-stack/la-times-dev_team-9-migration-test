import { DefaultUrlSerializer, UrlTree } from '@angular/router';
import { Injectable } from "@angular/core";

@Injectable()
export class LowerCaseUrlSerializer extends DefaultUrlSerializer {
  parse(url: string): UrlTree {
    const urlParts = url.split('?');
    urlParts[0] = urlParts[0].toLowerCase();
    return super.parse(urlParts.join('?'));
  }
}
