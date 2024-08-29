import {
  afterNextRender,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  Injector,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { CoursesService } from '../services/courses.service';
import { Course, sortCoursesBySeqNo } from '../models/course.model';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { CoursesCardListComponent } from '../courses-card-list/courses-card-list.component';
import { MatDialog } from '@angular/material/dialog';
import { MessagesService } from '../messages/messages.service';
import { catchError, from, throwError } from 'rxjs';
import {
  toObservable,
  toSignal,
  outputToObservable,
  outputFromObservable,
} from '@angular/core/rxjs-interop';
import { CoursesServiceWithFetch } from '../services/courses-fetch.service';
import { openEditCourseDialog } from '../edit-course-dialog/edit-course-dialog.component';
import { LoadingService } from '../loading/loading.service';

type Counter = {
  value: number;
};

@Component({
  selector: 'home',
  standalone: true,
  imports: [MatTabGroup, MatTab, CoursesCardListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  dialog = inject(MatDialog);
  async onAddCourse() {
    const newCourse = await openEditCourseDialog(this.dialog, {
      mode: 'create',
      title: 'Create new course!',
    });
    if (!newCourse) {
      return;
    }
    const newCourses = [...this.#courses(), newCourse];
    this.#courses.set(newCourses);
  }
  async onCourseDeleted(courseId: string) {
    try {
      await this.coursesService.deleteCourse(courseId);
      const courses = this.#courses();
      const newCourses = courses.filter((course) => course.id !== courseId);
      this.#courses.set(newCourses);
    } catch (err) {
      console.error(err);
      alert('Error deleting course!');
    }
  }
  onCourseUpdated(updatedCourse: Course) {
    const courses = this.#courses();
    const newCourse = courses.map((course) =>
      course.id === updatedCourse.id ? updatedCourse : course
    );
    this.#courses.set(newCourse);
  }
  ngOnInit(): void {
    // this.loadCourses();
  }
  constructor() {
    this.loadCourses().then(() =>
      console.log(`Courses loaded: `, this.#courses())
    );
    // this.courses$.subscribe((courses) => console.log(`courses$: `, courses));
    // afterNextRender(()=>{
    //   this.loadCourses().then(() =>
    //     console.log(`Courses loaded: `, this.courses())
    //   );
    // })
    effect(() => {
      // console.log('Beginner courses: ', this.beginnerCourses());
      // console.log('Advanced courses: ', this.advancedCourses());
    });
    effect(() => {
      // console.log(`Beginners list: `, this.beginnersList());
    });
  }

  #courses = signal<Course[]>([]);

  beginnerCourses = computed(() => {
    const courses = this.#courses();
    return courses.filter((course) => course.category === 'BEGINNER');
  });

  advancedCourses = computed(() => {
    const courses = this.#courses();
    return courses.filter((course) => course.category === 'ADVANCED');
  });

  // coursesService = inject(CoursesServiceWithFetch);
  coursesService = inject(CoursesService);

  loadingService = inject(LoadingService);
  messagesService = inject(MessagesService);

  async loadCourses() {
    //1 sposob
    // this.coursesService
    //   .loadAllCourses()
    //   .then((courses) => this.courses.set(courses))
    //   .catch((err) => console.error(err));

    //2 sposob
    try {
      // this.loadingService.loadingOn(); 1 sposob na ladowanie
      const courses = await this.coursesService.loadAllCourses();
      this.#courses.set(courses.sort(sortCoursesBySeqNo));
    } catch (err) {
      this.messagesService.showMessage('Error loading courses!', 'error');
    }
    // finally {
    //   this.loadingService.loadingOff();
    // }
  }

  // beginnersList = viewChild<CoursesCardListComponent>('beginnersList');
  beginnersList = viewChild('beginnersList', {
    read: ElementRef,
    // read: MatToolTip
  });

  // counter = signal<Counter>({ value: 100 });
  // counter = signal(0).asReadonly();
  // increment() {
  //   // this.counter.set(this.counter() + 1);
  //   // this.counter.update((counter) => counter + 1);
  //   // this.counter().value++; ŹLE
  //   this.counter.update((counter) => ({
  //     ...counter,
  //     value: counter.value + 1,
  //   }));
  // }
  // values = signal<number[]>([0]);
  // append() {
  //   this.values.update((values) => [...values, values[values.length - 1] + 1]);
  // }

  // courses$ = toObservable(this.#courses);

  injector = inject(Injector);
  // onToObservableExample() {
  //   // const courses$ = toObservable(this.#courses, {
  //   //   injector: this.injector,
  //   // });
  //   // courses$.subscribe((courses) => console.log(courses));
  //   const numbers = signal(0);
  //   const numbers$ = toObservable(numbers, {
  //     injector: this.injector,
  //   });
  //   numbers$.subscribe((number) => {
  //     console.log(`numbers$: `, number);
  //   });
  // }
  course$ = from(this.coursesService.loadAllCourses());
  onToSignalExample() {
    const courses = toSignal(this.course$, { injector: this.injector });
    effect(
      () => {
        console.log(`courses:`, courses());
      },
      {
        injector: this.injector,
      }
    );
  }
}
