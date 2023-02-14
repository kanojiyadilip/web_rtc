import { Component } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Http, Headers, Response} from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { CommonService } from '../../../common.service';

interface obj {
    resCode: number;
    resMsg: string;
    data: any;
    tokan: any;
  }

@Component({
  selector: 'doctor-schedule',
  templateUrl: './doctor-schedule.component.html'
})
export class DoctorScheduleComponent {
  public form:FormGroup;
  public settings: Settings;
  outPut: any;
  constructor(public appSettings:AppSettings, public fb: FormBuilder, public router:Router, private http: HttpClient, private atp: AmazingTimePickerService,  private activatedRoute : ActivatedRoute, public _com: CommonService){
    this.settings = this.appSettings.settings; 
    this.form = this.fb.group({
      'doctorId': [null, Validators.compose([Validators.required])],
      'department': [null, Validators.compose([Validators.required])],
      'day': [null, Validators.compose([Validators.required])],
      'fromTime': [null, Validators.compose([Validators.required])],
      'toTime': [null, Validators.compose([Validators.required])],
    });
    this.department();
    this.getOneDoctorSchedule();
    this.days();
  }

  public onSubmit(values):void{
    if (this.form.valid){
      this.http.post(this._com.baseUrl+'/updateDoctorSchedule', {adminId: localStorage.getItem('adminId'), doctorScheduleId: this.paramValue, doctorId: values.doctorId, department: values.department, day: values.day, fromTime: values.fromTime, toTime: values.toTime }).subscribe(
        result => {
          this.outPut = result;
          console.log("this.outPut===msg====>", this.outPut);
          if(this.outPut.resCode == 200){
            this.router.navigate(['/master/all-doctor-schedule']);
          }
          else{
            console.log("400===e====");
          }
        }      
      )
    }
  } 
  

paramValue: any;
getPData: any;
data: any = {};

  public getOneDoctorSchedule(){

    this.activatedRoute.params.subscribe(values => {
      this.paramValue = values.id;
      console.log("values=====>", this.paramValue);

      this.http.post(this._com.baseUrl+'/getOneDoctorSchedule', {adminId: localStorage.getItem('adminId'), doctorScheduleId: this.paramValue}).subscribe(
        result => {
          this.getPData = result;
          console.log("this.getPData===msg====>", this.getPData);
          if(this.getPData.resCode == 200){
            this.data = this.getPData.data;
            this.selectedFromTime = this.data.fromTime;
            this.selectedToTime = this.data.toTime;
            this.select(this.data.department);
            this.days();
          }
          else{
            console.log("400===e====");
          }
        }      
      )
    })
  } 

  docDecp: any;
  department(){
    this.http.post(this._com.baseUrl+'/getAlldepartment', {adminId: localStorage.getItem('adminId')}).subscribe( result => {
      this.docDecp = result;
      console.log("this.docDecp========>", this.docDecp);
        //this.stateData = this.stateDatas.data;
    })
  } 
  
  doctorList: any;
  select(departmentName){
    console.log("departmentName----->", departmentName);
    this.http.post(this._com.baseUrl+'/getDoctorByDepartmentName', {adminId: localStorage.getItem('adminId'), department: departmentName}).subscribe(result =>{
    this.doctorList = result;
    console.log("this.adminId: localStorage.getItem('adminId'), ----->", this.doctorList);
   })      
  }
 
  selectedToTime: any;
  selectedFromTime: any;
  public timeObj: any={};
  open1() {
    const amazingTimePicker = this.atp.open();
    amazingTimePicker.afterClose().subscribe(time1 => {
      this.timeObj.from = time1;
      this.selectedFromTime = time1;
      console.log(time1);
    });
  }  

  open2() {
    const amazingTimePicker = this.atp.open();
    amazingTimePicker.afterClose().subscribe(time2 => {
      this.timeObj.to = time2;
      this.selectedToTime = time2
      console.log(time2);
    });
  }   

  dayData: any;
  days(){
    this.http.get(this._com.baseUrl+'/getAllDay').subscribe( result => {
      this.dayData = result;
      console.log("this.dayData========>", this.dayData);
        //this.stateData = this.stateDatas.data;
    })
  } 

}