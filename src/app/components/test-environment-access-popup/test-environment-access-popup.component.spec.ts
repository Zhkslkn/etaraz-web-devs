import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestEnvironmentAccessPopupComponent } from './test-environment-access-popup.component';

describe('TestEnvironmentAccessPopupComponent', () => {
  let component: TestEnvironmentAccessPopupComponent;
  let fixture: ComponentFixture<TestEnvironmentAccessPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestEnvironmentAccessPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestEnvironmentAccessPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
