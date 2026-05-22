import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { registerLocaleData } from '@angular/common';
import localeAz from '@angular/common/locales/az';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatDateFormats
} from '@angular/material/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

import { routes } from './app.routes';
import { AzDateAdapter } from './az-date-adapter';
import { AzPaginatorIntl } from './utils/az-paginator-intl';

registerLocaleData(localeAz);

const AZ_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'dd.MM.yyyy'
  },
  display: {
    dateInput: 'dd.MM.yyyy',
    monthYearLabel: 'MMMM yyyy',
    dateA11yLabel: 'dd MMMM yyyy',
    monthYearA11yLabel: 'MMMM yyyy'
  }
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync(),
    { provide: LOCALE_ID, useValue: 'az' },
    { provide: MAT_DATE_LOCALE, useValue: 'az' },
    { provide: DateAdapter, useClass: AzDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: AZ_DATE_FORMATS },
    { provide: MatPaginatorIntl, useClass: AzPaginatorIntl }
  ]
};
