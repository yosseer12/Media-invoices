import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportFactures } from './import-factures';

describe('ImportFactures', () => {
  let component: ImportFactures;
  let fixture: ComponentFixture<ImportFactures>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportFactures]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportFactures);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
