import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './core/register/register.component';
import { LoginComponent } from './core/login/login.component';
import { ChatDashboardComponent } from './components/chat-dashboard/chat-dashboard.component';
import { LogListComponent } from './components/log-list/log-list.component';

const routes: Routes = [
  { path:'register', component:RegisterComponent},
  { path:'login', component:LoginComponent},
  { path:'chat', component:ChatDashboardComponent},
  { path:'logs', component:LogListComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
