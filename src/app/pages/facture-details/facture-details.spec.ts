import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactureDetails } from './facture-details';

describe('FactureDetails', () => {
  let component: FactureDetails;
  let fixture: ComponentFixture<FactureDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactureDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FactureDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
