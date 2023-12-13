import { Filter } from '@neuroglia/angular-ngrx-component-store-odata-table';
import { Filter as ODataQueryFilter } from 'odata-query';

export class FilterGuid implements Filter {
  isNull?: boolean | string = '';
  term: string;

  constructor(model?: FilterGuid) {
    if (model) {
      this.isNull = model.isNull;
      this.term = model.term;
    }
  }

  asODataQueryFilter(): ODataQueryFilter {
    if (typeof this.isNull === typeof true) {
      return this.isNull ? { eq: null } : { ne: null };
    }
    if (!this.term) return '';
    return {
      eq: {
        type: 'guid',
        value: this.term,
      },
    };
  }
}