import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisconnectedDisplayComponent } from './disconnected-display.component';

describe('DisconnectedDisplayComponent', () => {
  let component: DisconnectedDisplayComponent;
  let fixture: ComponentFixture<DisconnectedDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisconnectedDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisconnectedDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
