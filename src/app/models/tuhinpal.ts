export class Tuhinpal{
  id!: string;
  imdb!: string;
  contentType!: string;
  title!: string;
  image!: string;
  plot!: string;
  rating!: TuhinpalRating;
  contentRating!: string;
  genre!: Array<string>;
  year!: string;
  runtime!: string;
  actors!: Array<string>;
  directors!: Array<string>;
  top_credits!: Array<TuhinpalCredit>;
}

export class TuhinpalRating{
  count!: number;
  star!: number;
}

export class TuhinpalCredit{
  name!: string;
  value!: Array<string>;
}
