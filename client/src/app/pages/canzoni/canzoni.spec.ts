import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Canzoni } from './canzoni';

describe('Canzoni', () => {
  let component: Canzoni;
  let fixture: ComponentFixture<Canzoni>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Canzoni]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Canzoni);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
