import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable()
export class CookieService {

    private documentIsAccessible: boolean;

    constructor(@Inject(DOCUMENT) private document: any) {
        this.documentIsAccessible = document !== undefined;
    }

    check(name: string): boolean {
        if (!this.documentIsAccessible) {
            return false;
        }

        name = encodeURIComponent(name);

        const regExp: RegExp = this.getCookieRegExp(name);
        const exists: boolean = regExp.test(this.document.cookie);

        return exists;
    }

    get(name: string): string {
        if (this.documentIsAccessible && this.check(name)) {
            name = encodeURIComponent(name);

            const regExp: RegExp = this.getCookieRegExp(name);
            const result: RegExpExecArray = regExp.exec(this.document.cookie);

            return decodeURIComponent(result[1]);
        } else {
            return '';
        }
    }

    private getCookieRegExp(name: string): RegExp {
        const escapedName: string = name.replace(/([\[\]\{\}\(\)\|\=\;\+\?\,\.\*\^\$])/ig, '\\$1');

        return new RegExp('(?:^' + escapedName + '|;\\s*' + escapedName + ')=(.*?)(?:;|$)', 'g');
    }
}