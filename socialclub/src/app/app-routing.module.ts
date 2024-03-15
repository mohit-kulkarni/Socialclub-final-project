// app-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NewPostComponent } from './components/new-post/new-post.component';
import { HomeComponent } from './pages/home/home.component';
import { ExploreComponent } from './components/explore/explore.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { NavLayoutComponent } from './components/nav-layout/nav-layout.component';
import { AuthGuard } from './guards/services/auth.guard';
import { ReportComponent } from './components/report/report.component';
import { ForgetpswdComponent } from './components/forgetpswd/forgetpswd.component';
import { BookmarkComponent } from './components/bookmark/bookmark.component';

const routes: Routes = [
  {
    path: '',
    component: NavLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      // { path: 'dashboard', component: DashboardComponent },
      {
        path: 'new-post',
        component: NewPostComponent,
        canActivate: [AuthGuard],
      },
      { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
      {
        path: 'explore',
        component: ExploreComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'bookmark',
        component: BookmarkComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuard],
      },
      { path: 'report/:id', component: ReportComponent },
    ],
  },
  { path: '', redirectTo: 'join', pathMatch: 'full' }, // Default route
  { path: 'join', component: RegisterComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'forgotpwd', component: ForgetpswdComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
