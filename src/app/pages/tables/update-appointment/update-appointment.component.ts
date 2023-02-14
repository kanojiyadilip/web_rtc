import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Http, Headers, Response} from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { CommonService } from '../../../common.service';
import { HttpClient } from '@angular/common/http';

interface obj {
    resCode: number;
    resMsg: string;
    data: any;
    tokan: any;
  }

interface array{
  opdCharge1: number;
  opdCharge2: number;
  opdCharge3: number;
  ipdCharge: number;
  name: string;
}

interface obj1 {
    name: string;
    gender: string;
    dob: Date;
    mobileNo1: string;
    mobileNo2: string;
    address: string;
    state: string;
    city: string;
    pinCode: number;
    updateTime: Date;
  }  

@Component({
  selector: 'update-appointment',
  templateUrl: './update-appointment.component.html'
})
export class UpdateAppointmentComponent {
  @ViewChild('alert') alert: ElementRef;

  closeAlert() {
    this.alert.nativeElement.classList.remove('show');
    this.errMsg = "";
  }   
  public min = new Date();
  public form:FormGroup;
  public outPut: any;
  public settings: Settings;
  public errMsg: string="";
  constructor(public appSettings:AppSettings, public fb: FormBuilder, public router:Router, private activatedRoute : ActivatedRoute, private http: HttpClient, public _com: CommonService){
    this.settings = this.appSettings.settings; 
    this.form = this.fb.group({
      'name': [null, Validators.compose([Validators.required])],
      'dob': [null, Validators.compose([Validators.required])], 
      'department': [null, Validators.compose([Validators.required])], 
      'doctorId': [null, Validators.compose([Validators.required])], 
      'referenceBy': [null, Validators.compose([Validators.required])], 
      'opdSchedule': [null, Validators.compose([Validators.required])],
      'doctorCharges': [null,Validators.required],
      'otherCharges': [null,[Validators.pattern(/^(0|[1-9]\d*)?$/)]],
      'appointmentStatus': [null, Validators.required]
    });

    this.getOneAppointment();
    this.department();
  }


  public onSubmit(value):void {
    if (this.form.valid) {
      // this.router.navigate(['/']);
      this.http.post(this._com.baseUrl+'/updateAppointment', {adminId: localStorage.getItem('adminId'), appointmentId: this.paramValue, opdPatientName: value.name, opdPatientId: this.opdPatientId, dob: value.dob, doctorId: value.doctorId, department: value.department, opdScheduleUpdate: value.opdSchedule, referenceBy: value.referenceBy, doctorCharges: value.doctorCharges, doctorName: this.doctorDetail.name, otherCharges: value.otherCharges, appointmentStatus: value.appointmentStatus }).subscribe(
        result => {
          this.outPut = result;
          console.log("this.outPut=======>", this.outPut);
          if(this.outPut.resCode == 200){
            console.log("200=======");
            this.router.navigate(['/tables/filtering']);
          }
          else{
            this.errMsg = "true";
            console.log("400=======");
          }
        }
      )
    }
  }
  
  paramValue: any;
  getPData: any;
  opdPatientId: any;
  docChargase: any;
  data: any = {};
  getOneAppointment(){
    this.activatedRoute.params.subscribe(values => {
      console.log("values=====>", values);
      this.paramValue = values.id;
      console.log("values=====>", this.paramValue);
      this.http.post(this._com.baseUrl+"/getOneAppointment", {appointmentId: this.paramValue}).subscribe( result => {
        this.getPData = result;
        console.log("getPData=====>", this.getPData)
        if(this.getPData.resCode == 200){
          this.data = this.getPData.data
          this.opdPatientId = this.data.opdPatientId;
          this.docChargase = this.data.doctorCharges;
          console.log("this.docChargase=>", this.docChargase);
          console.log("this.data.doctorCharges==>",this.data.doctorCharges);
          console.log("this.data===>",this.data);
          this.select(this.data.department);
          this.doctorSelect(this.data.doctorId);
        }
        else if(this.getPData.resCode == 403){
          console.log("tokan is not provided");
        }
        else{
          console.log("+++++this.getPData+++++>",  this.getPData);
          this.router.navigate(['/master/filtering']);
        }
      })    
   });    
  } 

  docDecp: any;
  department(){
    this.http.post(this._com.baseUrl+"/getAlldepartment", {adminId: localStorage.getItem('adminId')}).subscribe( result => {
      this.docDecp = result;
      console.log("this.docDecp========>", this.docDecp);
    })
  }

  doctorList: any;
  select(departmentName){
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

}