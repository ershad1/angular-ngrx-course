import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {filter, first, tap} from 'rxjs/operators';
import {AppState} from '../../reducers';
import {CourseRequested} from '../course.actions';
import {selectCourseById} from '../course.selectors';
import {Course} from '../model/course';
import {CoursesService} from './courses.service';


@Injectable()
export class CourseResolver implements Resolve<Course> {

  constructor(
    private coursesService: CoursesService,
    private store: Store<AppState>) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Course> {

    const courseId = route.params['id'];

    return this.store
      .pipe(
        select(selectCourseById(courseId)),
        tap(course => {
          if (!course) {
            this.store.dispatch(new CourseRequested({courseId}));
          }
        }),
        filter(course => !!course),
        first()
      );

  }

}

