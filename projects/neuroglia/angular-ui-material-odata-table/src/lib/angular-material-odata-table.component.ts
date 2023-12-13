import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  EventEmitter,
  Output,
  ContentChild,
  ElementRef,
  inject,
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Sort as MatSort } from '@angular/material/sort';
import { Paging, Sort } from '@neuroglia/angular-datasource-odata';
import {
  ColumnDefinition,
  Filter,
  Filters,
  IODataTableComponent,
  ODataTableConfig,
  ODataTableStore,
  ShowFilterEvent,
} from '@neuroglia/angular-ngrx-component-store-odata-table';
import { Observable, Subject, map } from 'rxjs';
import { MaterialODataTableStore } from './material-odata-table.store';

@Component({
  selector: 'neuroglia-mat-odata-table',
  templateUrl: './angular-material-odata-table.component.html',
  styleUrls: ['./angular-material-odata-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MaterialODataTableStore],
})
export class NeurogliaNgMatDataTableComponent implements OnChanges, OnDestroy, IODataTableComponent {
  protected readonly store = inject(MaterialODataTableStore);
  @Input() configuration: ODataTableConfig;
  @Output() rowClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() rowExpanded: EventEmitter<any> = new EventEmitter<any>();
  @Output() selectionChanged: EventEmitter<any[]> = new EventEmitter<any[]>();
  @ContentChild('title') title!: ElementRef;
  @ContentChild('interations') interations!: ElementRef;
  columnDefinitions$: Observable<ColumnDefinition[]> = this.store.columnDefinitions$;
  displayedColumns$: Observable<string[]> = this.store.displayedColumns$;
  data$: Observable<any> = this.store.data$;
  error$: Observable<string> = this.store.error$;
  isLoading$: Observable<boolean> = this.store.isLoading$;
  stickHeader$: Observable<boolean> = this.store.stickHeader$;
  count$: Observable<number> = this.store.count$;
  sort$: Observable<Sort | null> = this.store.sort$;
  matSort$: Observable<MatSort | null> = this.sort$.pipe(
    map((sort) => (sort ? ({ active: sort.column, direction: sort.direction } as MatSort) : null)),
  );
  pageSize$: Observable<number | null> = this.store.pageSize$;
  pageIndex$: Observable<number | null> = this.store.pageIndex$;
  filters$: Observable<Filters> = this.store.filters$;
  serviceUrl$: Observable<string> = this.store.serviceUrl$;
  entityName$: Observable<string> = this.store.entityName$;
  enableSelection$: Observable<boolean> = this.store.enableSelection$;
  selectedRows$: Observable<any[]> = this.store.selectedRows$;
  enableRowExpansion$: Observable<boolean> = this.store.enableRowExpansion$;
  expandedRow$: Observable<any> = this.store.expandedRow$;
  enableColumnSettings$: Observable<boolean> = this.store.enableColumnSettings$;
  protected destroyNotifier: Subject<void> = new Subject<void>();

  ngOnChanges(changes: SimpleChanges): void {
    const { configuration } = changes;
    if (configuration.firstChange) {
      this.store.init(this.configuration).subscribe();
    }
  }

  ngOnDestroy(): void {
    this.store.destroy();
    this.destroyNotifier.next();
    this.destroyNotifier.complete();
  }

  onSortChange(sort: Sort | null) {
    this.store.sort(sort);
  }

  onPageChange(paging: Paging) {
    this.store.page(paging);
  }

  onShowFilter(evt: ShowFilterEvent) {
    const { filterComponentType, columnDefinition, filter } = evt;
    this.store.showFilterDialog(filterComponentType, columnDefinition, filter);
  }

  onShowColumnSettings() {
    this.store.showColumnSettingsDialog();
  }

  onExpandRow(row: any | null) {
    this.store.expandRow(row);
    this.rowExpanded.emit(row);
  }

  onSelectionChange(rows?: any[]) {
    this.store.selectRows(rows);
    this.selectionChanged.emit(rows);
  }

  clearSelection() {
    this.store.selectRows([]);
  }

  reload() {
    this.store.reload();
  }
}
