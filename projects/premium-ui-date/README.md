# @premium-ui/date

Premium UI Date System — locale-aware date, time, and calendar components for Angular.

## Install

```bash
npm install @premium-ui/date @internationalized/date @angular/cdk
```

## Quick start

```typescript
import { ApplicationConfig } from '@angular/core';
import { providePuiDate } from '@premium-ui/date';
import { PuiDatePickerComponent } from '@premium-ui/date';

export const appConfig: ApplicationConfig = {
  providers: [providePuiDate()],
};
```

```html
<pui-date-picker
  [config]="{
    locale: 'en-IN',
    timezone: 'Asia/Kolkata',
    format: 'dd/MM/yyyy'
  }"
  [(value)]="bookingDate"
/>
```

## Components

- `pui-date-picker` — single date with input + popup calendar
- `pui-date-range-picker` — range with analytics presets
- `pui-datetime-picker` — date + time
- `pui-time-picker` — 12h/24h time
- `pui-month-picker` / `pui-year-picker` / `pui-quarter-picker`
- `pui-calendar` — inline calendar (single, range, multiple)

## Architecture

All pickers share `PuiDateEngineService` for formatting, parsing, validation, localization, and timezone handling via `@internationalized/date`.
