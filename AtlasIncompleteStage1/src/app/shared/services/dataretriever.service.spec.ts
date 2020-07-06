import { TestBed } from '@angular/core/testing';

import { DataretrieverService } from './dataretriever.service';

describe('DataretrieverService', () => {
  let service: DataretrieverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataretrieverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
