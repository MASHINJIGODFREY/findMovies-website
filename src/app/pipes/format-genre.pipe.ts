import { Pipe, PipeTransform } from '@angular/core';
import { Genre } from '../models';

@Pipe({
  name: 'formatGenre'
})
export class FormatGenrePipe implements PipeTransform {

  transform(value: Array<Genre>): string{
    let genres = "...";
    if(typeof value !== "undefined" && typeof value === "object" && typeof value.forEach === "function"){
      value.forEach((genre, index, arr) => {
        (index === 0) ? genres = `${genre.name}` : genres = `${genres}, ${genre.name}`;
      });
    }
    return `${genres}`;
  }

}
