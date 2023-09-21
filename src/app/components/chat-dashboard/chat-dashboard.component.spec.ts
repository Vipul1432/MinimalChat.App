import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatDashboardComponent } from './chat-dashboard.component';

describe('ChatDashboardComponent', () => {
  let component: ChatDashboardComponent;
  let fixture: ComponentFixture<ChatDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatDashboardComponent]
    });
    fixture = TestBed.createComponent(ChatDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
