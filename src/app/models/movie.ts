import { Genre, Language, Country } from ".";

export class MovieMarkUp{
  adult!: boolean;
  backdrop_path!: string | null;
  id!: number;
  original_language!: string;
  original_title!: string;
  overview!: string;
  popularity!: number;
  poster_path!: string | null;
  release_date!: string;
  title!: string;
  video!: boolean;
  vote_average!: number;
  vote_count!: number;
}

export class Movie extends MovieMarkUp{
  genre_ids!: Array<number>;
}

export class MovieDetails extends MovieMarkUp{
  belongs_to_collection!: null | object;
  budget!: number;
  genres!: Array<Genre>;
  homepage!: string | null;
  imdb_id!: string | null;
  revenue!: number;
  runtime!: number | null;
  spoken_languages!: Array<Language>;
  production_countries!: Array<Country>;
  status!: MovieStatus;
  tagline!: string | null;
}

export enum MovieStatus{
  'Rumored',
  'Planned',
  'In Production',
  'Post Production',
  'Released',
  'Canceled'
}

export class Movies{
  page!: number;
  results!: Array<Movie>;
  total_pages!: number;
  total_results!: number;
}
