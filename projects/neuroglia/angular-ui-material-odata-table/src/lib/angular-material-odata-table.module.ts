import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NeurogliaNgCommonModule } from '@neuroglia/angular-common';
import { NeurogliaNgUiJsonPresenterModule } from '@neuroglia/angular-ui-json-presenter';

import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { NeurogliaNgMatDataTableComponent } from './angular-material-odata-table.component';
import {
  CellCompiledExpressionComponent,
  CellComponent,
  CellDateComponent,
  CellDefaultComponent,
  CellExpandedComponent,
  CellLinkComponent,
  CellNgrxActionComponent,
  CellNgrxActionWithConfirmComponent,
  ColumnSettingsComponent,
  ConfirmActionDialog,
  FilterComponent,
  FilterDateComponent,
  FilterEnumComponent,
  FilterExpressionComponent,
  FilterGuidComponent,
  FilterNumberComponent,
  FilterStringComponent,
  HeaderCompiledExpressionComponent,
  HeaderComponent,
  TableComponent,
} from './components';

@NgModule({
  declarations: [
    NeurogliaNgMatDataTableComponent,
    TableComponent,
    HeaderComponent,
    HeaderCompiledExpressionComponent,
    CellComponent,
    CellDateComponent,
    CellDefaultComponent,
    CellCompiledExpressionComponent,
    CellNgrxActionComponent,
    FilterComponent,
    FilterStringComponent,
    FilterEnumComponent,
    FilterGuidComponent,
    FilterDateComponent,
    FilterNumberComponent,
    FilterExpressionComponent,
    ColumnSettingsComponent,
    CellLinkComponent,
    CellExpandedComponent,
    CellNgrxActionWithConfirmComponent,
    ConfirmActionDialog,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NeurogliaNgCommonModule,

    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatDialogModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    MatExpansionModule,
    MatDatepickerModule,
    DragDropModule,

    NeurogliaNgUiJsonPresenterModule,
  ],
  exports: [NeurogliaNgMatDataTableComponent, TableComponent],
})
export class NeurogliaNgMatDataTableModule {}
