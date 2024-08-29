import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { LessonsComponent } from './lessons/lessons.component';
import { isUserAuthenticated } from './guards/auth.guard';
import { CourseComponent } from './course/course.component';
import { courseResolver } from './course/course.resolver';
import { LessonsResolver } from './course/lesons.resolver';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [isUserAuthenticated],
  },
  {
    path: 'courses/:courseId',
    component: CourseComponent,
    canActivate: [isUserAuthenticated],
    resolve: {
      course: courseResolver,
      lessons: LessonsResolver,
    },
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'lessons',
    component: LessonsComponent,
    canActivate: [isUserAuthenticated],
  },
  {
    path: '**',
    redirectTo: '/',
  },
];
