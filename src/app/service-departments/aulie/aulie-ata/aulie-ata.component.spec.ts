import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AulieAtaComponent } from './aulie-ata.component';

describe('AulieAtaComponent', () => {
  let component: AulieAtaComponent;
  let fixture: ComponentFixture<AulieAtaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AulieAtaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AulieAtaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
