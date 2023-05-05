import { Pipe } from '@angular/core';

@Pipe({
    name: 'search'
})
export class SearchPipe {
    transform(value: any, args?: any) {
        if (!value) return null;
        if (!args) return value;

        args = args.toLowerCase();

        return value.filter(function (item) {
            return JSON.stringify(item.Name).toLowerCase().includes(args);
        });
    }
}
