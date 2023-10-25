import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './_helpers/material/material.module';
import { NgToastModule } from 'ng-angular-popup';
import { NavbarComponent } from './core/navbar/navbar.component';
import { RegisterComponent } from './core/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './core/login/login.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { ChatDashboardComponent } from './components/chat-dashboard/chat-dashboard.component';
import { UserChatComponent } from './components/user-chat/user-chat.component';
import { EditMessageDialogComponent } from './_helpers/edit-message-dialog/edit-message-dialog.component';
import { LogListComponent } from './components/log-list/log-list.component';
import { DateTimeFormatPipe } from './_helpers/date-time-format.pipe';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AuthGuard } from './_helpers/auth-guard/auth.guard';
import { TokenInterceptor } from './_shared/interceptor/token.interceptor';
import { CreateGroupDialogComponent } from './_helpers/create-group-dialog/create-group-dialog/create-group-dialog.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddMembersDialogComponent } from './_helpers/add-members-dialog/add-members-dialog.component';
import { RemoveUserDialogComponent } from './_helpers/remove-user-dialog/remove-user-dialog.component';
import { EditGroupNameDialogComponent } from './_helpers/edit-group-name-dialog/edit-group-name-dialog.component';
import { MakeUserAdminDialogComponent } from './_helpers/make-user-admin-dialog/make-user-admin-dialog.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    RegisterComponent,
    LoginComponent,
    UserListComponent,
    ChatDashboardComponent,
    UserChatComponent,
    EditMessageDialogComponent,
    LogListComponent,
    DateTimeFormatPipe,
    NotFoundComponent,
    CreateGroupDialogComponent,
    AddMembersDialogComponent,
    RemoveUserDialogComponent,
    EditGroupNameDialogComponent,
    MakeUserAdminDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    NgToastModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    NgxExtendedPdfViewerModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    AuthGuard,
    { provide: MAT_DIALOG_DATA, useValue: {} },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
