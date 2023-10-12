import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeUserAdminDialogComponent } from './make-user-admin-dialog.component';

describe('MakeUserAdminDialogComponent', () => {
  let component: MakeUserAdminDialogComponent;
  let fixture: ComponentFixture<MakeUserAdminDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MakeUserAdminDialogComponent]
    });
    fixture = TestBed.createComponent(MakeUserAdminDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
