import { PipeTransform, Pipe } from "@angular/core";

@Pipe(
    { name: 'numberArrayPipe' }
)
export class NumberArrayPipe implements PipeTransform {
    transform(value: number) {
        let res = [];
        for (let i = 1; i < (value + 1); i++) {
            res.push(i.toString());
        }
        return res;
    }
}