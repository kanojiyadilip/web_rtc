import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormControl, NgForm, FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
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
  selector: 'app-update-ipd-patient',
  templateUrl: './update-ipd-patient.component.html',
  styleUrls: ['./update-ipd-patient.component.scss'],
})
export class UpdateIpdPatientComponent {
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
      'relativeName': [null, Validators.compose([Validators.required])],
      'relativeNumber': [null,[Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
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
      this.http.post(this._com.baseUrl+'/updatePatient', {adminId: localStorage.getItem('adminId'), IpdpatientId: this.paramValue, name: values.name, gender: values.gender, dob: values.dob, mobileNo1: values.mobileNo1, mobileNo2: values.mobileNo2, relativeName: values.relativeName, relativeNumber: values.relativeNumber,  address: values.address, state: values.state, city: values.city, pinCode: values.pinCode, img: this.image}).subscribe(
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
      this.http.post(this._com.baseUrl+'/getOnePatientDetail', {patientId: this.paramValue}).subscribe( result => {
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

// Angular 2 encode image to base64

changeListener($event) : void {
  this.readThis($event.target);
}
 
 image: any;
readThis(inputValue: any): void {
  var file:File = inputValue.files[0];
  var myReader:FileReader = new FileReader();
  console.log("myReader==>", myReader);

  myReader.onloadend = (e) => {
    this.image = myReader.result;
    console.log("this.image==>", this.image);
  }
  myReader.readAsDataURL(file);
}   

}