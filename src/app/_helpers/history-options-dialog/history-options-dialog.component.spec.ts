import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryOptionsDialogComponent } from './history-options-dialog.component';

describe('HistoryOptionsDialogComponent', () => {
  let component: HistoryOptionsDialogComponent;
  let fixture: ComponentFixture<HistoryOptionsDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistoryOptionsDialogComponent]
    });
    fixture = TestBed.createComponent(HistoryOptionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
