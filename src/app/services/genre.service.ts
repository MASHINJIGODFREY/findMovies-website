import { Injectable } from '@angular/core';
import { Genre } from '../models';

@Injectable({
  providedIn: 'root'
})
export class GenreService {

  constructor() { }

  public saveMoviesGenres(genres: Array<Genre>): void{
    localStorage.setItem("Movie_Genres", JSON.stringify(genres));
  }

  public getMoviesGenres(): Array<Genre> | null{
    let genres = localStorage.getItem("Movie_Genres");
    return (genres === null) ? null : JSON.parse(genres);
  }

  public saveTVShowsGenres(genres: Array<Genre>): void{
    localStorage.setItem("TV_Genres", JSON.stringify(genres));
  }

  public getTVShowsGenres(): Array<Genre> | null{
    let genres = localStorage.getItem("TV_Genres") || "";
    return JSON.parse(genres);
  }
}
