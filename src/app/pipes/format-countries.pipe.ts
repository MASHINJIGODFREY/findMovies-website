import { Pipe, PipeTransform } from '@angular/core';
import { Country } from '../models';

@Pipe({
    name: 'formatCountries',
    standalone: false
})
export class FormatCountriesPipe implements PipeTransform {

  transform(value: Array<Country>): string{
    let countries = "...";
    if(typeof value !== "undefined" && typeof value === "object" && typeof value.forEach === "function"){
      value.forEach((country, index, arr) => {
        (index === 0) ? countries = `${country.name}` : countries = `${countries}, ${country.name}`;
      });
    }
    return `${countries}`;
  }

}
