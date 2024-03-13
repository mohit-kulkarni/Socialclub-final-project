import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AsideDataComponent } from './components/aside-data/aside-data.component';
import { StoriesComponent } from './components/stories/stories.component';
import { HomeComponent } from './pages/home/home.component';
import { postsComponent } from './components/posts/posts.component';
import { postHeaderComponent } from './components/posts/post-header/post-header.component';
import { PostFooterComponent } from './components/posts/post-footer/post-footer.component';
import { postImageComponent } from './components/posts/post-image/post-image.component';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommentService } from './services/comment.service';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NewPostComponent } from './components/new-post/new-post.component';
import { ExploreComponent } from './components/explore/explore.component';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
// import { SendRequestComponent } from './components/send-request/send-request.component';
import { DropdownModule } from 'primeng/dropdown';
import { MenuModule } from 'primeng/menu';
import { ProfileComponent } from './components/profile/profile.component';
import { SearchComponent } from './components/search/search.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { NewPostService } from './services/new-post.service';
import { NavLayoutComponent } from './components/nav-layout/nav-layout.component';
import { FooterComponent } from './components/footer/footer.component';
import { ReportComponent } from './components/report/report.component';
import { ForgetpswdComponent } from './components/forgetpswd/forgetpswd.component';
import { FriendRequestService } from './services/friend-request.service';
import { StoriesViewComponent } from './components/stories-view/stories-view.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    AsideDataComponent,
    StoriesComponent,
    postsComponent,
    postHeaderComponent,
    PostFooterComponent,
    postImageComponent,
    DashboardComponent,
    NewPostComponent,
    ExploreComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    SearchComponent,
    NavLayoutComponent,
    FooterComponent,
    ReportComponent,
    ForgetpswdComponent,
    StoriesViewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ButtonModule,
    ToastModule,
    BrowserAnimationsModule,
    CardModule,
    ReactiveFormsModule,
    InputTextModule,
    MenuModule,
    DropdownModule,
  ],
  providers: [CommentService, MessageService, provideAnimationsAsync()],
  bootstrap: [AppComponent],
})
export class AppModule {}
