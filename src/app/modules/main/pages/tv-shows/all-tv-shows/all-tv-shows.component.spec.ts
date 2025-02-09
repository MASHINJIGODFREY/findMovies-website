import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllTvShowsComponent } from './all-tv-shows.component';

describe('AllTvShowsComponent', () => {
  let component: AllTvShowsComponent;
  let fixture: ComponentFixture<AllTvShowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllTvShowsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllTvShowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
