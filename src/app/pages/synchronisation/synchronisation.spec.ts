import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SynchronisationComponent } from './synchronisation';

describe('Synchronisation', () => {
  let component: SynchronisationComponent;
  let fixture: ComponentFixture<SynchronisationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SynchronisationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SynchronisationComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
