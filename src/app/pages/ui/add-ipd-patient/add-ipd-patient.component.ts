import { Component } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Http, Headers, Response} from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { CommonService } from '../../../common.service';

interface obj {
    resCode: number;
    resMsg: string;
    data: any;
    tokan: any;
  }

@Component({
  selector: 'add-ipd-patient',
  templateUrl: './add-ipd-patient.component.html'
})
export class AddIpdPatientComponent {
  public form:FormGroup;
  public settings: Settings;
  outPut: any;
  constructor(public appSettings:AppSettings, public fb: FormBuilder, public router:Router, private http: HttpClient, public _com: CommonService, public _actr: ActivatedRoute){
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
    // this.city();
  }

  public onSubmit(values):void {
    if (this.form.valid) {
      // this.router.navigate(['/']);
      this.http.post(this._com.baseUrl+'/createPatient', {adminId: localStorage.getItem('adminId'), name: values.name, gender: values.gender, dob: values.dob, mobileNo1: values.mobileNo1, mobileNo2: values.mobileNo2, relativeName: values.relativeName, relativeNumber: values.relativeNumber,  address: values.address, state: values.state, city: values.city, pinCode: values.pinCode, img: this.image}).subscribe(
        result => {
          this.outPut = result;
          console.log("this.outPut=======>", this.outPut);
          if(this.outPut.resCode == 200){
            console.log("200=======");
            //this.router.navigate(['/master/grids']);
            this.router.navigate(['/form-controls/radio-button',{queryValue: values.mobileNo1}]);
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