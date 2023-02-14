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
  selector: 'app-patient',
  templateUrl: './patient.component.html'
})
export class PatientComponent {
  @ViewChild('alert') alert: ElementRef;

  closeAlert() {
    this.alert.nativeElement.classList.remove('show');
    this.errMsg = "";
  }   
  public form:FormGroup;
  public outPut: any;
  public settings: Settings;
  public errMsg: string="";
  constructor(public appSettings:AppSettings, public fb: FormBuilder, public router:Router, private activatedRoute : ActivatedRoute, private http: HttpClient, public _com: CommonService){
    this.settings = this.appSettings.settings; 
    this.form = this.fb.group({
      'name': [null, Validators.compose([Validators.required])],
      'gender': [null, Validators.compose([Validators.required])],
      'dob': [null, Validators.compose([Validators.required])],
      'mobileNo1': [null,[Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]], 
      'mobileNo2': [null, [Validators.pattern(/^[6-9]\d{9}$/)]], 
      'address': [null, Validators.compose([Validators.required])], 
      'state': [null, Validators.compose([Validators.required])], 
      'city': [null, Validators.compose([Validators.required])], 
      'pinCode': [null, [Validators.required, Validators.pattern(/^[0-9]\d{5}$/)]]
    });

    this.state();
    this.getOnePatient();
  }

  public onSubmit(values):void {
    if (this.form.valid) {
      // this.router.navigate(['/']);
      this.http.post(this._com.baseUrl+'/updateOpdPatient', {adminId: localStorage.getItem('adminId'), opdPatientId: this.paramValue, name: values.name, gender: values.gender, dob: values.dob, mobileNo1: values.mobileNo1, mobileNo2: values.mobileNo2, address: values.address, state: values.state, city: values.city, pinCode: values.pinCode}).subscribe(
        result => {
          this.outPut = result;
          console.log("this.outPut=======>", this.outPut);
          if(this.outPut.resCode == 200){
            console.log("200=======");
            this.router.navigate(['/master/all-patient']);
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
  data: any = {};
  getOnePatient(){
    this.activatedRoute.params.subscribe(values => {
      console.log("values=====>", values);
      this.paramValue = values.id;
      console.log("values=====>", this.paramValue);
      this.http.post(this._com.baseUrl+'/getOneOpdPatient', {opdPatientId: this.paramValue}).subscribe( result => {
        this.getPData = result;
        if(this.getPData.resCode == 200){
          this.data = this.getPData.data
          this.select(this.data.state);
        }
        else if(this.getPData.resCode == 403){
          console.log("tokan is not provided");
        }
        else{
          this.router.navigate(['/master/all-patient']);
        }
      })    
   });    
  }

//   stateDatas: any;
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