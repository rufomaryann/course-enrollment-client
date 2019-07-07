import { Component, OnInit, ViewChild } from '@angular/core';
import { LogService } from 'src/app/services/log.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Log } from 'src/app/model/Log';
import { Course } from 'src/app/model/Course';
import { Ip } from 'src/app/model/Ip';
import { CourseService } from 'src/app/services/course.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {
  
  courseId: string;
  currentCourse: Course;
  currentLog: Log = new Log();
  courseHitCount: any;
  displayedColumns: string[] = ['name'];
  dataSource: MatTableDataSource<string> = new MatTableDataSource();
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private logService: LogService, 
    private courseService: CourseService,
    private router: Router, 
    private activatedRoute: ActivatedRoute) {
      this.currentCourse = JSON.parse(localStorage.getItem("currentCourse"));
     }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params=>{
      if(params.has("id")){
        this.courseId = params.get("id");
        this.currentLog.courseId = this.courseId;
        this.createLog();
        this.showSummary();
        this.findStudents();
      }
    });
  }

  ngAfterViewInit(){
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  createLog(){
    this.logService.getIpClient().subscribe((data: Ip)=>{
      this.currentLog.ip = data.ip;
      this.hit(data);
    });
  }

  hit(ip: Ip) {
    this.logService.createLog(this.currentLog).subscribe(data=>{
      console.log("hit: " + ip);
    });
  }

  showSummary() {
    this.logService.getSummaryOfCourse(this.courseId).subscribe(data=> {
      if(data){
        this.courseHitCount = data.hitCount;
      }else{
        this.courseHitCount = 0;
      }
    });
  }

  findStudents(){
   this.courseService.filterStudents(this.courseId).subscribe(data=>{
    this.dataSource = data;
   });
  }

}
