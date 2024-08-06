export class SearchedMovie{
  poster_path!: string;
  adult!: boolean;
  overview!: string;
  release_date!: string;
  original_title!: string;
  genre_ids!: Array<number>;
  id!: number;
  media_type!: MediaType;
  original_language!: string;
  title!: string;
  backdrop_path!: string;
  popularity!: number;
  vote_count!: number;
  video!: boolean;
  vote_average!: number;
}

export class SearchedTVShow{
  poster_path!: string;
  popularity!: number;
  id!: number;
  overview!: string;
  backdrop_path!: string;
  vote_average!: number;
  media_type!: MediaType;
  first_air_date!: string;
  origin_country!: Array<string>;
  genre_ids!: Array<number>;
  original_language!: string;
  vote_count!: number;
  name!: string;
  original_name!: string;
}

export class SearchedPerson{
  profile_path!: string;
  adult!: boolean;
  id!: number;
  media_type!: MediaType;
  known_for!: Array<SearchedMovie & SearchedTVShow>;
  name!: string;
  popularity!: number;
}

export enum MediaType{
  'movie',
  'tv',
  'person'
}

export class SearchResults{
  page!: number;
  results!: Array<SearchedMovie & SearchedTVShow & SearchedPerson>;
  total_results!: number;
  total_pages!: number;
}
