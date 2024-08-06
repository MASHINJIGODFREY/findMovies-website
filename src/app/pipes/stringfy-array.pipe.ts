import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringfyArray'
})
export class StringfyArrayPipe implements PipeTransform {

  transform(value: Array<string>): string{
    let stmt = "...";
    if(typeof value !== "undefined" && typeof value === "object" && typeof value.forEach === "function"){
      value.forEach((v, i, arr) => {
        (i === 0) ? stmt = `${v}` : stmt = `${stmt}, ${v}`;
      });
    }
    return `${stmt}`;
  }

}
