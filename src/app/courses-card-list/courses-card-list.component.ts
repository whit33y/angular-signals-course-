import {
  Component,
  effect,
  ElementRef,
  inject,
  input,
  output,
  viewChildren,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Course } from '../models/course.model';
import { MatDialog } from '@angular/material/dialog';
import { openEditCourseDialog } from '../edit-course-dialog/edit-course-dialog.component';

@Component({
  selector: 'courses-card-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './courses-card-list.component.html',
  styleUrl: './courses-card-list.component.scss',
})
export class CoursesCardListComponent {
  onCourseDeleted(course: Course) {
    this.courseDeleted.emit(course.id);
  }
  courses = input.required<Course[]>();

  courseUpdated = output<Course>();

  courseDeleted = output<string>();
  // {
  // alias: 'data'
  // transform: ''
  // }

  courseCards = viewChildren<ElementRef>('courseCard');
  // courseCards = viewChildren('courseCard', {read: ...});

  constructor() {
    effect(() => {
      console.log('courseCards:', this.courseCards());
    });
  }

  dialog = inject(MatDialog);

  async onEditCourse(course: Course) {
    const newCourse = await openEditCourseDialog(this.dialog, {
      mode: 'update',
      title: 'Update Existing Course',
      course: course,
    });
    if (!newCourse) {
      return;
    }
    console.log(`Course edited: `, newCourse);
    this.courseUpdated.emit(newCourse);
  }
}
