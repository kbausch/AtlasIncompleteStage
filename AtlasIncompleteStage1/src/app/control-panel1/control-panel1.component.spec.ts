import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlPanel1Component } from './control-panel1.component';

describe('ControlPanel1Component', () => {
  let component: ControlPanel1Component;
  let fixture: ComponentFixture<ControlPanel1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlPanel1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlPanel1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
