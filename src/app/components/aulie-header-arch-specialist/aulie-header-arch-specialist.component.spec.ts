import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AulieHeaderArchSpecialistComponent } from './aulie-header-arch-specialist.component';

describe('AulieHeaderArchSpecialistComponent', () => {
  let component: AulieHeaderArchSpecialistComponent;
  let fixture: ComponentFixture<AulieHeaderArchSpecialistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AulieHeaderArchSpecialistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AulieHeaderArchSpecialistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
