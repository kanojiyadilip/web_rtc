import { Component } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormArray } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Http, Headers, Response} from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { CommonService } from '../../../common.service';
import { HttpClient } from '@angular/common/http';

interface obj {
    resCode: number;
    resMsg: string;
    data: any;
    tokan: any;
  }
interface arrayItem{
    day: string;
    from: string;
    to: string;
}  

interface tobj{
  from: string;
  to: string;
} 

@Component({
  selector: 'app-update-staff',
  templateUrl: './update-staff.component.html',
  //imports: [ FormsModule ]
})
export class StaffUpdateComponent {
  public form:FormGroup;
  public settings: Settings;
  outPut: any;
  constructor(public appSettings:AppSettings, public fb: FormBuilder, public router:Router, private activatedRoute : ActivatedRoute, private http: HttpClient, private atp: AmazingTimePickerService, public _com: CommonService){
    this.settings = this.appSettings.settings; 
    this.form = this.fb.group({
      'name': [null, Validators.compose([Validators.required])],
      'gender': [null, Validators.compose([Validators.required])],
      'dob': [null, Validators.compose([Validators.required])],
      'JoiningDate': [null, Validators.compose([Validators.required])],
      'mobileNo1': [null,[Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]], 
      'mobileNo2': [null, [Validators.pattern(/^[6-9]\d{9}$/)]], 
      'address': [null, Validators.compose([Validators.required])], 
      'state': [null, Validators.compose([Validators.required])], 
      'city': [null, Validators.compose([Validators.required])], 
      'pinCode': [null, [Validators.required, Validators.pattern(/^[0-9]\d{5}$/)]],
      // 'schedules': this.fb.array([this.doctorSchedule()]) //OPD-schedules
    });

    this.state();
    this.getOneStaff();
    // this.city();

    this.nuseDegree = this._com.nuseDegree;
    this.experience = this._com.experience;    
  }

  nuseDegree: any;
  experience: any;
  private doctorSchedule() {
    return this.fb.group({
      'drday': [null, Validators.compose([Validators.required])],
      'drfrom': [null, Validators.compose([Validators.required])],
      'drto': [null, Validators.compose([Validators.required])]
    });
  }

  private addRow() {
    const control = <FormArray>this.form.controls['schedules'];
    control.push(this.doctorSchedule());
  }

  private removeRow(i: number) {
    const control = <FormArray>this.form.controls['schedules'];
    control.removeAt(i);
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


paramValue: any;
getPData: any;
data: any = {};
drTimes: any;
getOneStaff(){
  this.activatedRoute.params.subscribe(values => {
    console.log("values=====>", values);
    this.paramValue = values.id;
    console.log("values=====>", this.paramValue);
    this.http.post(this._com.baseUrl+'/getOneStaff', {staffId: this.paramValue}).subscribe( result => {
      this.getPData = result;
      console.log("this.getPData=====>", this.getPData);
      if(this.getPData.resCode == 200){
        this.data = this.getPData.data;
        this.select(this.data.state);
      }
      else if(this.getPData.resCode == 403){
        console.log("tokan is not provided");
      }
      else{
        this.router.navigate(['/nurse/nurse-list']);
      }
    })    
 });    
}


  public fieldArray: Array<arrayItem> = [];
  public newAttribute: any = {};
  public onSubmit(values):void {
    console.log("values=+=+=+>", values);
    if (this.form.valid) {
      // this.router.navigate(['/']);
      this.http.post(this._com.baseUrl+'/updateStaff', {adminId: localStorage.getItem('adminId'), staffId: this.paramValue, name: values.name, gender: values.gender, dob: values.dob, mobileNo1: values.mobileNo1, mobileNo2: values.mobileNo2, address: values.address, state: values.state, city: values.city, pinCode: values.pinCode, department: values.department, degree: values.degree, experience: values.experience, joiningDate: values.JoiningDate, img: this.image}).subscribe(
        result => {
          this.outPut = result;
          console.log("this.outPut=======>", this.outPut);
          if(this.outPut.resCode == 200){
            console.log("200=======");
            this.router.navigate(['/staff/staff-list']);
          }
          else{
            console.log("400=======");
          }
        }
      )
    }
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
      this.selectedFromTime = time2
      console.log(time2);
    });
  }  
 
  select(stateid){
    console.log("stateid----->", stateid);
    this.http.post("https://node-pos.herokuapp.com/city", {state: stateid}).subscribe(result =>{
    this.cityData = result;
    console.log("this.cityData----->", this.cityData);
   })      
  }

  addFieldValue(){
      console.log("this.newAttribute=====>", this.newAttribute);
    this.fieldArray.push(this.newAttribute)
    console.log("this.fieldArray=====>", this.fieldArray);
  } 

  deleteFieldValue(index) {
    console.log("index=====>", index);
    this.fieldArray.splice(index, 1);
  } 
  
}