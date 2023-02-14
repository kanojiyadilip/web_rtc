import { Component } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonService } from '../../../common.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatTableDataSource } from '@angular/material';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { TablesService, Element } from '../tables.service';
import { Http, Headers, Response} from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { OwlMomentDateTimeModule } from 'ng-pick-datetime-moment';
import {
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    DateTimeAdapter,
    OWL_DATE_TIME_FORMATS,
    OWL_DATE_TIME_LOCALE,
    OwlDateTimeComponent,
    OwlDateTimeFormats
} from 'ng-pick-datetime';
import { MomentDateTimeAdapter } from 'ng-pick-datetime-moment';
import * as _moment from 'moment';
import { Moment } from 'moment';

const moment = (_moment as any).default ? (_moment as any).default : _moment;

export const MY_CUSTOM_FORMATS = {
    parseInput: 'l LT',
    fullPickerInput: 'l LT',
    datePickerInput: 'DD/MM/YYYY',
    timePickerInput: 'LT',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
};

interface array{
	opdCharge1: number;
	opdCharge2: number;
	opdCharge3: number;
	ipdCharge: number;
	name: string;
}

@Component({
  selector: 'app-basic',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.scss'],
  providers: [ {provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE]},
        {provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS}]   
})
export class BasicComponent {
  public displayedColumns = ['No', 'Name', 'Gender', 'DOB', 'Mobile', 'Mobile2', 'PinCode', 'Take Appointment'];
  public dataSource: any;
  public settings: Settings;
  public form:FormGroup;
  constructor(public appSettings:AppSettings, private tablesService:TablesService, private http: HttpClient, public fb: FormBuilder, public router:Router, public _com: CommonService) {
    this.settings = this.appSettings.settings; 
    //this.dataSource = new MatTableDataSource<Element>(this.tablesService.getData());

    this.form = this.fb.group({
      'name': [null, Validators.compose([Validators.required])],
      'gender': [null, Validators.compose([Validators.required])],
      'dob': [null, Validators.compose([Validators.required])],
      'mobileNo1': [null,[Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]], 
      'mobileNo2': [null, [Validators.pattern(/^[6-9]\d{9}$/)]],
      'address': [null, Validators.compose([Validators.required])],
      'state': [null, Validators.compose([Validators.required])],
      'city': [null, Validators.compose([Validators.required])],
      'pinCode': [null, Validators.compose([Validators.required])], 
      'department': [null, Validators.compose([Validators.required])], 
      'doctorId': [null, Validators.compose([Validators.required])], 
      'referenceBy': [null, Validators.compose([Validators.required])], 
      'opdSchedule': [null, Validators.required],
      'doctorCharges': [null,Validators.required],
      'otherCharges': [null,[Validators.pattern(/^(0|[1-9]\d*)?$/)]],
    });
    
    this.department();
    this.state();
  }
  
  public min = new Date();
  outPut: any;
  searchValue: any;
  patientRegisterdOrNot: string='false';
  SearchData: boolean = false;
  patinetAppointFrom: boolean = false;
  patinetNotFound: boolean = false;

  searchPatient(value){
  this.searchValue = value.target.value;
  	console.log("this.searchValue----->", this.searchValue);
  	this.http.post(this._com.baseUrl+'/searchOpdPatientByMobileNo', {adminId: localStorage.getItem('adminId'), query: this.searchValue}).subscribe(
  		result =>{
	  		 	this.outPut = result;
	  		 	console.log("outPut======>", this.outPut);
	  		 	if( this.outPut.resCode == 200){
	  		 	this.patinetAppointFrom = false;
	  		 	this.SearchData = true;
	  		 	this.patinetNotFound = false;
	  		 	this.dataSource = new MatTableDataSource<Element[]>(this.outPut.data);
  		 	}
  		 	else if(this.outPut.resCode == 400){
  		 		 this.patinetNotFound = true;
  		 		 this.SearchData = false;
  		 	}
  		 	else{
  		 		this.patinetNotFound = false;
  		 		this.patientRegisterdOrNot = 'true';
  		 		this.SearchData = false;
  		 	}
  		}
  	)
  }

  patientName: any;
  patinetDob: any;
  opdPatientId: any;
  public data: any = {};
  getPatientForAppointment(evn){
  	console.log("evn======>", evn);
  	this.SearchData = false;
  	this.patinetAppointFrom = true;
  	this.patientName = evn.name;
  	this.patinetDob = evn.dob;
  	this.opdPatientId = evn._id;
    this.data = evn;
    this.select(this.data.state);
  }

  newPatientAppointment(){
    this.SearchData = false;
    this.patinetAppointFrom = true;
    this.opdPatientId = null; 
    this.patinetNotFound = false; 
  }


  docDecp: any;
  department(){
    this.http.post(this._com.baseUrl+"/getAlldepartment", {adminId: localStorage.getItem('adminId')}).subscribe( result => {
      this.docDecp = result;
      console.log("this.docDecp========>", this.docDecp);
    })
  }

  doctorList: any;
  selectDoc(departmentName){
    console.log("departmentName----->", departmentName);
    this.http.post(this._com.baseUrl+"/getDoctorByDepartmentName", {adminId: localStorage.getItem('adminId'), department: departmentName}).subscribe(result =>{
    this.doctorList = result;
    console.log("this.adminId: localStorage.getItem('adminId'), ----->", this.doctorList);
   })      
  }

  oneDoctor: any;
  doctorCharges1: any;
  doctorCharges2: any;
  doctorCharges3: any; 
  doctorDetail: array;
  doctorSelect(selectDoctorId){
	this.http.post(this._com.baseUrl+"/getOneDoctor", {adminId: localStorage.getItem('adminId'), doctorId: selectDoctorId}).subscribe(result =>{
    this.oneDoctor = result;
    this.doctorDetail = this.oneDoctor.data;
    this.doctorCharges1 = this.doctorDetail.opdCharge1;
    this.doctorCharges2 = this.doctorDetail.opdCharge2;
    this.doctorCharges3 = this.doctorDetail.opdCharge3;
   })
  }

  getData: any;
  onSubmit(value){
	 if (this.form.valid) {
	 	console.log("this.form.valid.value->", value);
		this.http.post(this._com.baseUrl+"/createAppointment",{adminId: localStorage.getItem('adminId'), name: value.name, opdPatientName: value.name, dob: value.dob, gender: value.gender, mobileNo1: value.mobileNo1, mobileNo2: value.mobileNo2, address: value.address, state: value.state, city: value.city, pinCode: value.pinCode, doctorId: value.doctorId, department: value.department, opdScheduleCreateDate: value.opdSchedule, referenceBy: value.referenceBy, doctorCharges: value.doctorCharges, doctorName: this.doctorDetail.name, opdPatientId: this.opdPatientId, otherCharges: value.otherCharges }).subscribe(result =>{
			this.getData = result;
			if(this.getData.resCode == 200){
				console.log("res status=> ", this.getData.resMsg);
				this.router.navigate(['/tables/filtering']);
			}
      else if(this.getData.resCode == 400){
          alert(this.getData.resMsg);
          return false;
      }      
			else{
				console.log("res status=> ", this.getData.resMsg);
				return false;
			}
		})
	 }	
	 else{
	    return false;
	 }
  }

  stateData: any;
  cityData: any;
  state(){
    this.http.get("https://node-pos.herokuapp.com/state").subscribe( result => {
      this.stateData = result;
        //this.stateData = this.stateDatas.data;
    })
  }
  
  select(stateid){
    console.log("stateid----->", stateid);
    this.http.post("https://node-pos.herokuapp.com/city", {state: stateid}).subscribe(result =>{
    this.cityData = result;
    console.log("this.cityData----->", this.cityData);
    })      
  }

}