import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGroupNameDialogComponent } from './edit-group-name-dialog.component';

describe('EditGroupNameDialogComponent', () => {
  let component: EditGroupNameDialogComponent;
  let fixture: ComponentFixture<EditGroupNameDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditGroupNameDialogComponent]
    });
    fixture = TestBed.createComponent(EditGroupNameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
