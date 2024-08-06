import { Crew, Genre, GuestStars, Language, Country } from ".";

export class SeriesMarkUp{
  poster_path!: string | null;
  popularity!: number;
  id!: number;
  backdrop_path!: string | null;
  vote_average!: number;
  overview!: string;
  first_air_date!: string;
  origin_country!: Array<string>;
  original_language!: string;
  vote_count!: number;
  name!: string;
  original_name!: string;
}

export class Series extends SeriesMarkUp{
  genre_ids!: Array<number>;
}

export class SeriesDetails extends SeriesMarkUp{
  episode_run_time!: Array<number>;
  genres!: Array<Genre>;
  homepage!: string;
  in_production!: boolean;
  languages!: Array<string>;
  last_air_date!: string;
  last_episode_to_air!: Episode;
  next_episode_to_air!: Episode;
  number_of_episodes!: number;
  number_of_seasons!: number;
  seasons!: Array<Season>;
  spoken_languages!: Array<Language>;
  production_countries!: Array<Country>;
  status!: string;
  tagline!: string;
  type!: string;
}

export class TVShows{
  page!: number;
  results!: Array<Series>;
  total_pages!: number;
  total_results!: number;
}

export class Season{
  _id!: string;
  air_date!: string;
  episodes!: Array<Episode>;
  episode_count!: number;
  name!: string;
  overview!: string;
  id!: number;
  poster_path!: string;
  season_number!: number;
}

export class Episode{
  air_date!: string;
  episode_number!: number;
  crew!: Array<Crew>;
  guest_stars!: Array<GuestStars>;
  id!: number;
  name!: string;
  overview!: string;
  production_code!: string;
  season_number!: number;
  still_path!: string;
  vote_average!: number;
  vote_count!: number;
}

export class ExternalIDs{
  imdb_id!: string;
  freebase_id!: string;
  freebase_mid!: string;
  tvdb_id!: number;
  tvrage_id!: number;
  facebook_id!: string;
  instagram_id!: string;
  twitter_id!: string;
  id!: number;
}
