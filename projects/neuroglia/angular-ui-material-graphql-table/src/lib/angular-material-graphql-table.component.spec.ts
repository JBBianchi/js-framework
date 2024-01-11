import { ComponentFixture, ComponentFixtureAutoDetect, TestBed, fakeAsync } from '@angular/core/testing';

import { NeurogliaNgMatGraphQLDataTableComponent } from './angular-material-graphql-table.component';
import { provideHttpClient } from '@angular/common/http';
import { NamedLoggingServiceFactory } from '@neuroglia/angular-logging';
import { HttpErrorObserverService, UrlHelperService } from '@neuroglia/angular-rest-core';
import { KeycloakService } from 'keycloak-angular';
import { GraphQLTableStore, GraphQLTableConfig } from '@neuroglia/angular-ngrx-component-store-graphql-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NeurogliaNgCommonModule } from '@neuroglia/angular-common';
import { NeurogliaNgMatQueryableDataTableModule } from '@neuroglia/angular-ui-material-queryable-table';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NeurogliaNgUiJsonPresenterModule } from '@neuroglia/angular-ui-json-presenter';
import { combineLatest, filter, from, take } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  expandRowColumnDefinition,
  selectRowColumnDefinition,
} from '@neuroglia/angular-ngrx-component-store-queryable-table';
import { humanCase } from '@neuroglia/common';
import {
  GRAPHQL_DATA_SOURCE_VARIABLES_MAPPER,
  GraphQLQueryArguments,
  GraphQLVariablesMapper,
} from '@neuroglia/angular-data-source-graphql';
import { CombinedParams } from '@neuroglia/angular-data-source-queryable';
import {
  GraphQLEnumType,
  GraphQLList,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLSchema,
  IntrospectionQuery,
  buildClientSchema,
  getIntrospectionQuery,
  getNamedType,
} from 'graphql';

const testEndpoint = 'https://swapi-graphql.netlify.app/.netlify/functions/index';

const config: GraphQLTableConfig = {
  dataSourceType: 'graphql',
  serviceUrl: testEndpoint,
  target: 'allPlanets',
  targetSubField: 'planets',
  countSubField: 'data.allPlanets.totalCount', //for OData like responses: [ 'data', '@odata.count' ]
  dataSubField: 'data.allPlanets.planets',
  useMetadata: true,
  columnDefinitions: [],
};

const getPlanetsQuery = `query GetPlanets($first: Int, $last: Int, $after: String, $before: String) {
  allPlanets(first: $first, last: $last, after: $after, before: $before) {
    pageInfo {
      startCursor
      endCursor
      hasNextPage
      hasPreviousPage
    }
    planets {
      name
      id
      climates
      created
      diameter
      edited
      gravity
      orbitalPeriod
      population
      rotationPeriod
      surfaceWater
      terrains
    }
    totalCount
    edges {
      cursor
      node {
        climates
        created
        diameter
        edited
        gravity
        id
        name
        population
        orbitalPeriod
        rotationPeriod
        surfaceWater
        terrains
      }
    }
  }
}`;

const variablesMapper: GraphQLVariablesMapper = (
  args: GraphQLQueryArguments | null,
  combinedParams: CombinedParams<any>,
): GraphQLQueryArguments => {
  const [_, __, pagingParam] = combinedParams;
  const variables: any = {};
  if (pagingParam?.top) {
    variables.first = pagingParam.top;
    if (pagingParam.skip) {
      variables.after = btoa(`arrayconnection:${pagingParam.skip - 1}`);
    }
  }
  return variables;
};

describe('NeurogliaNgMatGraphQLDataTableComponent', () => {
  let store: GraphQLTableStore;
  let expectedMetadata: GraphQLSchema;
  let expectedPlanetFields: string[];
  let expectedPlanetResponse: any;
  let fixture: ComponentFixture<NeurogliaNgMatGraphQLDataTableComponent>;
  let component: NeurogliaNgMatGraphQLDataTableComponent;
  let componentElement: HTMLElement;

  beforeAll((done) => {
    const query = getIntrospectionQuery();
    combineLatest([
      from(
        fetch(testEndpoint, {
          headers: {
            'content-type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({ query }),
        }).then((res) => res.json()),
      ),
      from(
        fetch(testEndpoint, {
          headers: {
            'content-type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({ query: getPlanetsQuery }),
        }).then((res) => res.json()),
      ),
    ])
      .pipe(take(1))
      .subscribe({
        next: ([introspection, planetsResponse]: [{ data: IntrospectionQuery }, any]) => {
          expectedMetadata = buildClientSchema(introspection.data);
          const planetType = expectedMetadata.getType('Planet') as GraphQLObjectType;
          expectedPlanetFields = Object.values(planetType!.getFields())
            .filter((field) => {
              const namedType = getNamedType(field.type);
              const isNavigationProperty = !(
                namedType instanceof GraphQLScalarType || namedType instanceof GraphQLEnumType
              );
              const isCollection = field.type instanceof GraphQLList;
              return !field.args?.length && !isNavigationProperty && !isCollection;
            })
            .map((field) => field.name);
          expectedPlanetResponse = planetsResponse;
          done();
        },
        error: (err) => {
          throw err;
        },
      });
  });

  beforeEach(async () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
    await TestBed.configureTestingModule({
      providers: [
        { provide: ComponentFixtureAutoDetect, useValue: true },
        provideHttpClient(),
        NamedLoggingServiceFactory,
        HttpErrorObserverService,
        UrlHelperService,
        KeycloakService,
        GraphQLTableStore,
        { provide: GRAPHQL_DATA_SOURCE_VARIABLES_MAPPER, useValue: variablesMapper },
      ],
      imports: [
        NoopAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        NeurogliaNgCommonModule,
        NeurogliaNgMatQueryableDataTableModule,

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
      declarations: [NeurogliaNgMatGraphQLDataTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NeurogliaNgMatGraphQLDataTableComponent);
    component = fixture.componentInstance;
    componentElement = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should display the data table', async () => {
    component.isLoading$
      .pipe(
        filter((isLoading) => !isLoading),
        take(1),
      )
      .subscribe({
        next: async () => {
          fixture.detectChanges();
        },
      });
    fixture.componentRef.setInput('configuration', config);
    fixture.detectChanges();
    return fixture.whenStable().then(() => {
      let expectedColumns = [...expectedPlanetFields];
      if (config.enableSelection === true) {
        expectedColumns = [selectRowColumnDefinition.name, ...expectedColumns];
      }
      if (config.enableRowExpansion === true) {
        expectedColumns = [expandRowColumnDefinition.name, ...expectedColumns];
      }
      let expectedColumnsCount = expectedColumns.length;
      const facade = componentElement.querySelector('neuroglia-mat-queryable-table-facade');
      const progressBar = componentElement.querySelector('mat-progress-bar');
      const queryableTableEntry = componentElement.querySelector('neuroglia-mat-queryable-table-table');
      const responsiveTable = componentElement.querySelector('.responsive-table > table');
      const thead = responsiveTable?.querySelector('thead');
      const headers = Array.from(thead?.querySelectorAll('th') || []);
      const tbody = responsiveTable?.querySelector('tbody');
      const rows = Array.from(tbody?.querySelectorAll('tr') || []);
      const tfoot = responsiveTable?.querySelector('tfoot');
      const footer = componentElement.querySelector('.table-footer');
      const enableColumnSettings = footer?.querySelector('.column-settings');
      const paginator = footer?.querySelector('mat-paginator');

      expect(component).withContext('component').toBeDefined();
      expect(facade).withContext('facade').toBeDefined();
      expect(progressBar).withContext('progressBar').toBeDefined();
      expect(queryableTableEntry).withContext('queryableTableEntry').toBeDefined();
      expect(responsiveTable).withContext('responsiveTable').toBeDefined();
      expect(thead).withContext('thead').toBeDefined();
      expect(tbody).withContext('tbody').toBeDefined();
      expect(tfoot).withContext('tfoot').toBeDefined();
      expect(footer).withContext('footer').toBeDefined();
      if (config.enableColumnSettings === false) {
        expect(enableColumnSettings).withContext('enableColumnSettings').toBeFalsy();
      } else {
        expect(enableColumnSettings).withContext('enableColumnSettings').toBeDefined();
      }
      expect(paginator).withContext('paginator').toBeDefined();
      expect(headers.length).withContext('headers count').toBe(expectedColumnsCount);
      expect(rows.length).withContext('rows count').toBe(20);
      expectedColumns.forEach((column, index) => {
        const humanColumn = humanCase(column, true);
        expect(headers[index].textContent).withContext(`header '${humanColumn}'(#${index})`).toContain(humanColumn);
      });
    });
  });
});
