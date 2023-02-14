import { Component, OnInit, ViewChild } from '@angular/core';
import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';
import { Router } from '@angular/router';
import { Http, Headers, Response} from '@angular/http';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { CommonService } from '../../common.service';
import { HttpClient } from '@angular/common/http';

interface obj {
  resCode: number;
  resMsg: string;
  data: any;
  tokan: any;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public displayedColumns = ['No', 'Patient Name', 'Token No', 'Doctor Name', 'Department', 'Schedule', 'PatientNumber', 'status'];
  public dataSource: any;
  public settings: Settings;
  outPut: any;
  constructor(public appSettings:AppSettings, private http: HttpClient, public router:Router, public _com: CommonService){
    this.settings = this.appSettings.settings;
    this.getAllTodayAppointments(); 
  }

  ngOnInit() {
  }

  public getAllTodayAppointments(){
    this.http.post(this._com.baseUrl+'/getAllTodayAppointment', {adminId: localStorage.getItem('adminId')}).subscribe(
      result => {
        this.outPut = result;
        console.log("this.outPut===data====>", this.outPut.data);
        if(this.outPut.resCode == 200){
          this.dataSource = new MatTableDataSource<Element[]>(this.outPut.data);
          this.dataSource.paginator = this.paginator;
          // this.dataSource.filter = filterValue.trim().toLowerCase();
          // this.dataSource = new MatTableDataSource<Element>(this.data);
          // console.log("200===1====", this.dataSource.paginator);
          console.log("200dataSource2====", this.dataSource);
        }
        else{
          console.log("400===e====");
        }
      }      
    )
  } 
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


}
