import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DebugButtonsComponent } from './debug-buttons.component';

describe('DebugButtonsComponent', () => {
  let component: DebugButtonsComponent;
  let fixture: ComponentFixture<DebugButtonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DebugButtonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DebugButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
