import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApzHeaderComponent } from './apz-header.component';

describe('ApzHeaderComponent', () => {
  let component: ApzHeaderComponent;
  let fixture: ComponentFixture<ApzHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApzHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApzHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
