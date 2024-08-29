import {
  Component,
  contentChild,
  effect,
  ElementRef,
  input,
  model,
} from '@angular/core';
import { CourseCategory } from '../models/course-category.model';

@Component({
  selector: 'course-category-combobox',
  standalone: true,
  imports: [],
  templateUrl: './course-category-combobox.component.html',
  styleUrl: './course-category-combobox.component.scss',
})
export class CourseCategoryComboboxComponent {
  label = input.required<string>();
  value = model.required<CourseCategory>();
  title = contentChild<ElementRef>('title');
  // title = contentChildren<ElementRef>('title'); w przypadku wiecej niz jednego children'a

  constructor() {
    effect(() => {
      console.log('title: ', this.title());
    });
  }

  onCategoryChanged(category: string) {
    this.value.set(category as CourseCategory);
  }
}
