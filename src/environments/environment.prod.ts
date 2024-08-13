export const environment = {
  production: false,
  version: '1.2.9',
  copyright: '2021-24',
  github: 'https://github.com/MASHINJIGODFREY',
  api: {
    tmdb: {
      url: `https://api.themoviedb.org/3`,
      img: {
        url: `https://image.tmdb.org/t/p`,
        sizes: { original: `original` },
      },
      key: '52bb64cfc4910dbb62742f2e0342bb58',
      site: 'https://www.themoviedb.org'
    },
    torrent: {
      url: `https://torrent-api-py-nx0x.onrender.com/api/v1`,
      github: 'https://github.com/Ryuk-me/Torrent-Api-py'
    },
    tuhinpal: {
      url: `https://imdb-api.tprojects.workers.dev`,
      github: 'https://github.com/tuhinpal/imdb-api'
    },
    omdb: {
      url: `https://www.omdbapi.com`,
      key: `b9dccd20`,
      site: 'https://www.omdbapi.com'
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
