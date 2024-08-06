export const environment = {
  production: true,
  version: '1.2.8',
  api: {
    tmdb: {
      url: `https://api.themoviedb.org/3`,
      img: {
        url: `https://image.tmdb.org/t/p`,
        sizes: { original: `original` },
      },
      key: '52bb64cfc4910dbb62742f2e0342bb58'
    },
    torrent: {
      url: `https://torrents-api.ryukme.repl.co/api`
    },
    tuhinpal: {
      url: `https://imdb-api.tprojects.workers.dev`
    },
    omdb: {
      url: `http://www.omdbapi.com`,
      key: `b9dccd20`
    },
    country_codes: {
      url: {
        iso3: `http://country.io/iso3.json`,
        names: `http://country.io/names.json`
      }
    }
  },
  resources: {
    loadingImage: `assets/img/default-image.jpg`,
    errorImage: `assets/img/no-image.jfif`
  }
};
