import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DivaltoSync } from './divalto-sync';

describe('DivaltoSync', () => {
  let component: DivaltoSync;
  let fixture: ComponentFixture<DivaltoSync>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DivaltoSync]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DivaltoSync);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
