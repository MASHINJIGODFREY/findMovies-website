import { Pipe, PipeTransform } from '@angular/core';
import { Language } from '../models';

@Pipe({
    name: 'formatLanguages',
    standalone: false
})
export class FormatLanguagesPipe implements PipeTransform {

  transform(value: Array<Language>): string{
    let languages = "...";
    if(typeof value !== "undefined" && typeof value === "object" && typeof value.forEach === "function"){
      value.forEach((language, index, arr) => {
        (index === 0) ? languages = `${language.english_name}` : languages = `${languages}, ${language.english_name}`;
      });
    }
    return `${languages}`;
  }

}
