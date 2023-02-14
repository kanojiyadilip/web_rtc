import { Component } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatTableDataSource } from '@angular/material';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
//import { TablesService, Element } from '../tables.service';
import { Http, Headers, Response} from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../common.service';
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
  selector: 'app-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss']
})
export class RadioButtonComponent {
  public displayedColumns = ['No', 'Name', 'Gender', 'DOB', 'Mobile', 'Mobile2', 'PinCode', 'Take Admission'];
  public dataSource: any;
  public settings: Settings;
  public form:FormGroup;
  constructor(public appSettings:AppSettings, private http: HttpClient, public fb: FormBuilder, public router:Router, public _com: CommonService, public _actr: ActivatedRoute) {
    this.settings = this.appSettings.settings; 
    //this.dataSource = new MatTableDataSource<Element>(this.tablesService.getData());

    this.form = this.fb.group({
      'name': [null, Validators.compose([Validators.required])],
      'gender': [null, Validators.compose([Validators.required])],
      'dob': [null, Validators.compose([Validators.required])],
      'mobileNo1': [null,[Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]], 
      'mobileNo2': [null, [Validators.pattern(/^[6-9]\d{9}$/)]], 
      'relativeName': [null, Validators.compose([Validators.required])],
      'relativeNumber': [null,[Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      'address': [null, Validators.compose([Validators.required])], 
      'state': [null, Validators.compose([Validators.required])], 
      'city': [null, Validators.compose([Validators.required])], 
      'pinCode': [null, [Validators.required, Validators.pattern(/^[0-9]\d{5}$/)]],
      'bloodGroup':  [null, Validators.compose([Validators.required])],
      'height': '',
      'weight': '',
      'treatment': [null, Validators.compose([Validators.required])], 
      'referenceBy': [null, Validators.compose([Validators.required])],
      'bedCategoryId': [null, Validators.compose([Validators.required])],
      'bedId': [null, Validators.compose([Validators.required])],
      'perDayPrice': [null, Validators.compose([Validators.required])],

      //'admitDate': [null, Validators.compose([Validators.required])], 
      //'dischargeDate': [null, Validators.compose([Validators.required])],
      'remark': '',
      //'patientStatus': [null, Validators.compose([Validators.required])],
    });
    
    this.bloodGroupList = this._com.bloodGroup;
    this.department();
    this.patientStatus();
    console.log("this._com->", this._com);
    //this.pvalue =  this.router.snapshot.queryParamMap.get('queryValue');
    this.searchPatient(null);
    this.patinetNotFound = false;
    this.state();
    this.getAllBedCategory();
  }

  bloodGroupList: any;
  pvalue: any;
  public min = new Date();
  outPut: any;
  searchValue: any;
  patientRegisterdOrNot: string='false';
  SearchData: boolean = false;
  patinetAppointFrom: boolean = false;
  patinetNotFound: boolean = false;

  searchPatient(value){
    console.log("value------->", value);
    if(this._actr.snapshot.queryParams['queryValue'] != null || value == null)
    { 
    this.searchValue = this._actr.snapshot.queryParams['queryValue'];
      
    }
    else{

      this.searchValue = value.target.value;
    }
  
    console.log("this.searchValue----->", this.searchValue);
    this.http.post(this._com.baseUrl+'/searchIpdPatient', {adminId: localStorage.getItem('adminId'), query: this.searchValue}).subscribe(
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
  ipdPatientId: any;
  data: any = {};
  getPatientForAdmission(evn){
    console.log("evn======>", evn);
    this.SearchData = false;
    this.patinetAppointFrom = true;
    this.patientName = evn.name;
    this.patinetDob = evn.dob;
    this.ipdPatientId = evn._id;
    this.data = evn;
  }

  newPatientAdmission(){
    this.SearchData = false;
    this.patinetAppointFrom = true;
    this.ipdPatientId = null; 
    this.patinetNotFound = false; 
  }

  docDecp: any;
  department(){
    this.http.post(this._com.baseUrl+'/getAlldepartment', {adminId: localStorage.getItem('adminId')}).subscribe( result => {
      this.docDecp = result;
      console.log("this.docDecp========>", this.docDecp);
    })
  }

  doctorList: any;
   Doselect(departmentName){
    console.log("departmentName----->", departmentName);
    this.http.post(this._com.baseUrl+'/getDoctorByDepartmentName', {adminId: localStorage.getItem('adminId'), department: departmentName}).subscribe(result =>{
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
  this.http.post(this._com.baseUrl+'/getOneDoctor', {adminId: localStorage.getItem('adminId'), doctorId: selectDoctorId}).subscribe(result =>{
    this.oneDoctor = result;
    this.doctorDetail = this.oneDoctor.data;
    this.doctorCharges1 = this.doctorDetail.opdCharge1;
    this.doctorCharges2 = this.doctorDetail.opdCharge2;
    this.doctorCharges3 = this.doctorDetail.opdCharge3;
   })
  }

  getData: any;
  admitDate: any = new Date(); 
  onSubmit(values){
   if (this.form.valid) {
    console.log("this.form.valid.values->", values);
    this.http.post(this._com.baseUrl+'/createPatientAdmission',{adminId: localStorage.getItem('adminId'), patientId: this.ipdPatientId, ipdPatinetName: values.name, dob: values.dob, bloodGroup: values.bloodGroup, height: values.height, weight: values.weight, treatment: values.treatment, admitDate: this.admitDate, dischargeDate: values.dischargeDate, referenceBy: values.referenceBy, remark: values.remark, patientStatus: 'ADMIT',name: values.name, gender: values.gender, mobileNo1: values.mobileNo1, mobileNo2: values.mobileNo2, relativeName: values.relativeName, relativeNumber: values.relativeNumber, address: values.address, state: values.state, city: values.city, pinCode: values.pinCode, img: this.image,
    bedCategoryId: values.bedCategoryId, bedId: values.bedId, perDayPrice: values.perDayPrice }).subscribe(result =>{
      this.getData = result;
      if(this.getData.resCode == 200){
        console.log("res status=> ", this.getData.resMsg);
        this.router.navigate(['/form-controls/slide-toggle']);
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
  
  patientAllStatus: any;
  patientStatus(){
    this.http.get(this._com.baseUrl+'/getPatientStatus').subscribe( result => {
      this.patientAllStatus = result;
        //this.stateData = this.patientAllStatus.data;
    })
  }  



  stateData: any;
  cityData: any;
  dayData: any;
  state(){
    this.http.get('https://node-pos.herokuapp.com/state').subscribe( result => {
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


  // Angular 2 encode image to base64

  changeListener($event) : void {
    this.readThis($event.target);
  }
   
   image: any;
  readThis(inputValue: any): void {
    var file = inputValue.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event: any) => { 
      this.image = event.target.result;
      console.log("image---image--->", this.image);
    }
  } 



   perDayPrice: any;
   allBedC: any;
   getAllBedCategory(){
    this.http.post(this._com.baseUrl+'/getAllBedCategory', {adminId: localStorage.getItem('adminId')}).subscribe(
      result => {
        this.allBedC = result;
        console.log("this.allBedC=>", this.allBedC);
      }
    )
   }

   BedC: any;
   bedData: any
   allBed: any;
   bedPrice: any;
   getbed(evn){
   console.log("evn=>", evn);
    this.http.post(this._com.baseUrl+'/getAllBedBYBedCategory', {adminId: localStorage.getItem('adminId'), bedCategoryId: evn}).subscribe(
      result => {
        this.allBed = result;
        console.log("this.allBed=>", this.allBed);
      }) 

    this.http.post(this._com.baseUrl+'/getOneBedCategory', {bedCategoryId: evn}).subscribe(
      result => {
        this.BedC = result;
        this.bedData = this.BedC.data;
        this.bedPrice = this.bedData.price;
        console.log("this.BedC=>", this.BedC);
        console.log("this.bedData=>", this.bedData);
      })
   }



  //favoriteSeason: string;
  //seasons = ['Winter','Spring','Summer','Autumn',];
}