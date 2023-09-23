import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMessageDialogComponent } from './edit-message-dialog.component';

describe('EditMessageDialogComponent', () => {
  let component: EditMessageDialogComponent;
  let fixture: ComponentFixture<EditMessageDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditMessageDialogComponent]
    });
    fixture = TestBed.createComponent(EditMessageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
