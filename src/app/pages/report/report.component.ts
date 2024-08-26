import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { PageContentComponent } from '../../components/page-content/page-content.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ReportService } from '../../services/report.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, finalize } from 'rxjs';
import { getHttpErrorMessage } from '../../utils/get-http-error-message.util';
import { OrdersReportDto } from '../../dtos/orders-report.dto';
import { PreloaderComponent } from '../../components/page-preloader/preloader.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule, MatDateRangePicker } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { GetOrdersReportQueryDto } from '../../dtos/get-orders-report-query.dto';
import { MatIcon } from '@angular/material/icon';

enum DateAlias {
  Today = 'today',
  Yesterday = 'yesterday',
  Week = 'week',
  Month = 'month',
  All = 'all',
}

interface PersistedConfig {
  selectedDateAlias: DateAlias;
  selectedDate: {
    startIso: string |  null;
    endIso: string | null;
  };
}

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [
    PageContentComponent,
    MatProgressSpinner,
    PreloaderComponent,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    ReactiveFormsModule,
    DatePipe,
    NgTemplateOutlet,
    MatIcon,
  ],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss',
})
export class ReportComponent implements OnInit {

  private readonly reportService = inject(ReportService);
  private readonly toastr = inject(ToastrService);

  private readonly persistenceKey = 'report-config';

  readonly today = new Date(new Date().setHours(0, 0, 0, 0));
  readonly dateRangeForm = new FormGroup({
    start: new FormControl<Date | null>(this.today),
    end: new FormControl<Date | null>(this.today),
  });
  readonly aliasesEnum = DateAlias;
  readonly dateAliases = [
    { value: DateAlias.Today, label: 'Сьогодні' },
    { value: DateAlias.Yesterday, label: 'Вчора' },
    { value: DateAlias.Week, label: 'Тиждень' },
    { value: DateAlias.Month, label: 'Місяць' },
    { value: DateAlias.All, label: 'За весь час' },
  ];
  selectedDateAlias: DateAlias;

  isLoading = signal<boolean>(false);
  orderReport = signal<OrdersReportDto>(null);
  private datepicker = viewChild(MatDateRangePicker);

  ngOnInit(): void {
    this.setConfigFromPersistence();
    this.fetchReport();

    this.dateRangeForm.valueChanges
      .pipe(debounceTime(100),)
      .subscribe(() => {
        this.persistConfig();
        this.fetchReport();
      });
  }

  private fetchReport() {
    const dateRange = this.dateRangeForm.getRawValue();
    const getOrderReportDto: GetOrdersReportQueryDto = {};
    if (dateRange.start) {
      getOrderReportDto.fromIso = dateRange.start.toISOString();
    }
    if (dateRange.end) {
      getOrderReportDto.toIso = dateRange.end.toISOString();
    }

    this.isLoading.set(true);
    this.reportService.fetchOrderReport(getOrderReportDto)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: response => {
          this.orderReport.set(response);
        },
        error: error => this.toastr.error(getHttpErrorMessage(error), `Не вдалося отримати дані по замовленням`),
      });
  }

  selectDateAlias(alias: DateAlias): void {
    this.selectedDateAlias = alias;

    let startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    let endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    switch (alias) {
      case DateAlias.Yesterday:
        startDate.setDate(this.today.getDate() - 1);
        endDate.setDate(this.today.getDate() - 1);
        break;
      case DateAlias.Week:
        startDate.setDate(this.today.getDate() - 7);
        break;
      case DateAlias.Month:
        startDate.setMonth(this.today.getMonth() - 1);
        break;
      case DateAlias.All:
        startDate = null;
        endDate = null;
        break;
    }

    this.dateRangeForm.setValue({ start: startDate, end: endDate });
    this.datepicker().close();
  }

  isSelectedSameDate(): boolean {
    const dateRange = this.dateRangeForm.getRawValue();
    const hasStartAndNoEnd = dateRange.start && !dateRange.end;
    const isSameDate = dateRange.start.getFullYear() === dateRange.end?.getFullYear()
      && dateRange.start.getMonth() === dateRange.end?.getMonth()
      && dateRange.start.getDate() === dateRange.end?.getDate();

    return hasStartAndNoEnd || isSameDate;
  }

  onDateManualChange(): void {
    this.selectedDateAlias = null;
  }

  getSelectedDateAliasLabel(): string {
    return this.dateAliases.find(alias => alias.value === this.selectedDateAlias)?.label;
  }

  private persistConfig(): void {
    const dateRange = this.dateRangeForm.getRawValue();
    const config: PersistedConfig = {
      selectedDateAlias: this.selectedDateAlias,
      selectedDate: {
        startIso: dateRange.start?.toISOString(),
        endIso: dateRange.end?.toISOString(),
      },
    };

    localStorage.setItem(this.persistenceKey, JSON.stringify(config));
  }

  private setConfigFromPersistence(): void {
    const config: PersistedConfig = JSON.parse(localStorage.getItem(this.persistenceKey));
    if (!config) {
      this.selectDateAlias(DateAlias.Today);
      return;
    }

    if (config.selectedDateAlias) {
      this.selectDateAlias(config.selectedDateAlias);
    } else {
      this.dateRangeForm.setValue({
        start: config.selectedDate.startIso ? new Date(config.selectedDate.startIso) : null,
        end: config.selectedDate.endIso ? new Date(config.selectedDate.endIso) : null,
      });
    }
  }
}
