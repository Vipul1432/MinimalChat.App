import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './core/register/register.component';
import { LoginComponent } from './core/login/login.component';
import { ChatDashboardComponent } from './components/chat-dashboard/chat-dashboard.component';
import { LogListComponent } from './components/log-list/log-list.component';
import { AuthGuard } from './_helpers/auth-guard/auth.guard';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { UserChatComponent } from './components/user-chat/user-chat.component';

const routes: Routes = [
  { path: '', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'chat', component: ChatDashboardComponent },
  { path: 'chat/user/:userId', component: UserChatComponent },
  { path: 'logs', component: LogListComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
