import { NgModule } from '@angular/core';

import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from "@angular/material/legacy-progress-spinner";
import { MatLegacySnackBarModule as MatSnackBarModule } from "@angular/material/legacy-snack-bar";
import { MatLegacyFormFieldModule as MatFormFieldModule } from "@angular/material/legacy-form-field";
import { MatLegacyInputModule as MatInputModule } from "@angular/material/legacy-input";
import { MatLegacyProgressBarModule as MatProgressBarModule } from "@angular/material/legacy-progress-bar";
import { MatLegacyTableModule as MatTableModule } from "@angular/material/legacy-table";
import { MatLegacyMenuModule as MatMenuModule } from "@angular/material/legacy-menu";
import { MatSortModule } from "@angular/material/sort";
import { MatLegacyPaginatorModule as MatPaginatorModule } from "@angular/material/legacy-paginator";
import { MatBottomSheetModule } from "@angular/material/bottom-sheet";
import { MatLegacyListModule as MatListModule } from "@angular/material/legacy-list";
import { MatIconModule } from "@angular/material/icon";
import { MatLegacyCheckboxModule as MatCheckboxModule } from "@angular/material/legacy-checkbox";
import { MatLegacyTooltipModule as MatTooltipModule, MAT_LEGACY_TOOLTIP_DEFAULT_OPTIONS as MAT_TOOLTIP_DEFAULT_OPTIONS } from "@angular/material/legacy-tooltip";
import { MatDividerModule } from "@angular/material/divider";
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MatLegacyDialogModule as MatDialogModule, MAT_LEGACY_DIALOG_DEFAULT_OPTIONS as MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/legacy-dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatBadgeModule } from '@angular/material/badge';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatNativeDateModule, MatRippleModule, MAT_DATE_LOCALE } from '@angular/material/core';

import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { CustomTooltipDefaults } from 'src/app/factories/CustomTooltipDefaults';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatExpansionModule } from '@angular/material/expansion';

const MaterialModules = [
  MatAutocompleteModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRippleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatTooltipModule,
  ScrollingModule
];

@NgModule({
  imports: [MaterialModules],
  providers: [
    {provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: CustomTooltipDefaults},
    {provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }},
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false }},
  ],
  exports: [MaterialModules]
})
export class MaterialModule { }
