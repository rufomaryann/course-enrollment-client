import { Component, OnInit, ViewChild } from '@angular/core';
import { CourseService } from 'src/app/services/course.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Course } from 'src/app/model/Course';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Transaction } from 'src/app/model/Transaction';
import { User } from 'src/app/model/User';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {

  courses: Array<Course>;
  currentUser: User;
  dataSource: MatTableDataSource<Course> = new MatTableDataSource();
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort
  displayedColumns: string[] = ['detail', 'title', 'author', 'category', 'action'];
  errorMessage: string;
  infoMessage: string;


  constructor(private courseService: CourseService, private router: Router, private activatedRoute: ActivatedRoute) { 
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.findAllCourses();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  findAllCourses() {
    this.courseService.findAllCourses()
      .subscribe(data=>{
        this.dataSource = data;
      });
  }

  enroll(course: Course) {
    if(!this.currentUser){
      this.errorMessage="To enroll a course, you should sign in.";
      return;
    }

    var transaction = new Transaction();
    transaction.course = course;
    transaction.userId = this.currentUser.id;

    this.courseService.enroll(transaction)
      .subscribe(data=>{
        this.infoMessage="You enrolled.";
      }, err=>{
        this.errorMessage="Unexpected Error.";
      });
  }

  detail(course: Course){
    localStorage.setItem("currentCourse", JSON.stringify(course));
    this.router.navigate(['/course', course.id]);
  }

}
