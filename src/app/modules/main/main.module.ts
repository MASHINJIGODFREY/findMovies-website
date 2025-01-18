import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { AboutComponent } from './pages/about/about.component';
import { AllMoviesComponent, TopRatedMoviesComponent, UpcomingMoviesComponent } from './pages/movies';
import { AllTvShowsComponent, TopRatedTvShowsComponent } from './pages/tv-shows';
import { DurationPipe, FormatCountriesPipe, FormatDatePipe, FormatGenrePipe, FormatLanguagesPipe, SafePipe, StringfyArrayPipe } from 'src/app/pipes';
import { HomeComponent, MoviesComponent, TvShowsComponent } from './pages';
import { FooterComponent, NavbarComponent } from './layout';
import { IfNotDirective } from 'src/app/directives';
import { DownloadComponent, LoadingSpinnerComponent, MovieDetailsComponent, SeriesDetailsComponent, TorrentsComponent } from './components';
import { ClipboardModule } from 'ngx-clipboard';
import { provideHttpCache, withHttpCacheInterceptor } from '@ngneat/cashew';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { MaterialModule } from '../shared/material.module';
import { ImgService, MovieService, NavigationService, OmdbService, SearchService, SeriesService, TorrentService, TuhinpalService, UiService } from 'src/app/services';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({ declarations: [
        AboutComponent,
        AllMoviesComponent,
        AllTvShowsComponent,
        DownloadComponent,
        DurationPipe,
        FooterComponent,
        FormatCountriesPipe,
        FormatDatePipe,
        FormatGenrePipe,
        FormatLanguagesPipe,
        HomeComponent,
        IfNotDirective,
        LoadingSpinnerComponent,
        MainComponent,
        MoviesComponent,
        MovieDetailsComponent,
        NavbarComponent,
        SafePipe,
        SeriesDetailsComponent,
        StringfyArrayPipe,
        TopRatedMoviesComponent,
        TopRatedTvShowsComponent,
        TorrentsComponent,
        TvShowsComponent,
        UpcomingMoviesComponent,
    ], imports: [CommonModule,
        ClipboardModule,
        LazyLoadImageModule,
        MainRoutingModule,
        MaterialModule,
        NgxSkeletonLoaderModule,
        ReactiveFormsModule], providers: [
        ImgService,
        MovieService,
        NavigationService,
        OmdbService,
        SearchService,
        SeriesService,
        TorrentService,
        TuhinpalService,
        UiService,
        provideHttpClient(withInterceptors([withHttpCacheInterceptor()]),withInterceptorsFromDi()),
        provideHttpCache({ strategy: 'explicit', ttl: 604800000 })
    ] })
export class MainModule { }
