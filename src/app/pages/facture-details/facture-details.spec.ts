import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactureDetailsComponent } from './facture-details';

describe('FactureDetailsComponent', () => {
  let component: FactureDetailsComponent;
  let fixture: ComponentFixture<FactureDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactureDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FactureDetailsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
