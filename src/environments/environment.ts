// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
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

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
