import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Pipe({
  name: 'source'
})
export class SourcePipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) {

    }

    transform(url: string): SafeUrl {
        return this.sanitizer.sanitize(SecurityContext.RESOURCE_URL, this.sanitizer.bypassSecurityTrustResourceUrl(url));
    };
}
