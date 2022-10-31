import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSubmitApplicationComponent } from './dialog-submit-application.component';

describe('DialogSubmitApplicationComponent', () => {
  let component: DialogSubmitApplicationComponent;
  let fixture: ComponentFixture<DialogSubmitApplicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogSubmitApplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSubmitApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
