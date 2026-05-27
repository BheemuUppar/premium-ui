import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { PUI_TABLE_PAGE_SIZE_OPTIONS } from '../table.constants';

@Component({
  selector: 'pui-table-pagination',
  templateUrl: './table-pagination.component.html',
  styleUrl: './table-pagination.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PuiTablePaginationComponent {
  readonly pageIndex = input(0);
  readonly pageSize = input(10);
  readonly totalRows = input(0);
  readonly pageSizeOptions = input<readonly number[]>(PUI_TABLE_PAGE_SIZE_OPTIONS);

  readonly pageChange = output<{ pageIndex: number; pageSize: number }>();

  protected readonly pageCount = computed(() =>
    Math.max(1, Math.ceil(this.totalRows() / Math.max(1, this.pageSize())))
  );

  protected readonly rangeStart = computed(() => {
    if (!this.totalRows()) {
      return 0;
    }
    return this.pageIndex() * this.pageSize() + 1;
  });

  protected readonly rangeEnd = computed(() =>
    Math.min(this.totalRows(), (this.pageIndex() + 1) * this.pageSize())
  );

  protected goPrevious(): void {
    if (this.pageIndex() > 0) {
      this.pageChange.emit({ pageIndex: this.pageIndex() - 1, pageSize: this.pageSize() });
    }
  }

  protected goNext(): void {
    if (this.pageIndex() < this.pageCount() - 1) {
      this.pageChange.emit({ pageIndex: this.pageIndex() + 1, pageSize: this.pageSize() });
    }
  }

  protected onPageSizeChange(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);
    if (!Number.isNaN(value) && value > 0) {
      this.pageChange.emit({ pageIndex: 0, pageSize: value });
    }
  }
}
