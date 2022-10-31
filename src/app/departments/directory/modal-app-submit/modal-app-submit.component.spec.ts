import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAppSubmitComponent } from './modal-app-submit.component';

describe('ModalAppSubmitComponent', () => {
  let component: ModalAppSubmitComponent;
  let fixture: ComponentFixture<ModalAppSubmitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAppSubmitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAppSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
