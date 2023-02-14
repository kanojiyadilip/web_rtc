import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, Response} from '@angular/http';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { emailValidator, matchingPasswords } from '../../theme/utils/app-validators';
import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';
import { CommonService } from '../../common.service';
import { HttpClient } from '@angular/common/http';

interface obj {
  resCode: number;
  resMsg: string;
  data: any;
  tokan: any;
}

interface obj1 {
  _id: any;
  name: string;
  emailId: string;
}

@Component({
  selector: 'app-update-admin',
  templateUrl: './update-admin.component.html'
})
export class UpdateAdminComponent {
  public form:FormGroup;
  public settings: Settings;
  constructor(public appSettings:AppSettings, public fb: FormBuilder, public router:Router, private http: HttpClient, public _com: CommonService){
    this.settings = this.appSettings.settings; 
    this.form = this.fb.group({
      'name': [null, [Validators.required]],
      'hospitalName': [null, [Validators.required]],
      'mobileNo': [null,[Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      'telephoneNo': [null, [Validators.compose([Validators.pattern(/^[0-9\-\(\)\, ]+$/)])]],
      'address': [null, Validators.compose([Validators.required])], 
      'state': [null, Validators.compose([Validators.required])], 
      'city': [null, Validators.compose([Validators.required])], 
      'pinCode': [null, [Validators.required, Validators.pattern(/^[0-9]\d{5}$/)]]
    });

    // this.getAdminData();
    this.state();
  }
  


 // Angular 2 encode image to base64

   img: any;
  readThis(inputValue: any): void {
    var file = inputValue.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event: any) => { 
      this.img = event.target.result;
      console.log("img---img--->", this.img);
    }
  } 

  imgUpload($event) : void {
    this.readThis($event.target);
  }


   logo: any;
  readThis2(inputValue: any): void {
    var file2 = inputValue.files[0];
    var reader2 = new FileReader();
    reader2.readAsDataURL(file2);
    reader2.onload = (event: any) => { 
      this.logo = event.target.result;
      console.log("logo---logo--->", this.logo);
    }
  }

  logoUpload($event) : void {
    this.readThis2($event.target);
  }  


  outPut: any;
  data2: obj1;
  errMsg: string= "";
  success: string= "";

  public onSubmit(values):void {
    console.log("values----->", values);
    if (this.form.valid) {
      //this.router.navigate(['/login']);

      this.http.post(this._com.baseUrl+'/updateAdmin', {adminId: localStorage.getItem('adminId'), name: values.name, hospitalName: values.hospitalName, mobileNo: values.mobileNo, telephoneNo: values.telephoneNo, address: values.address, state: values.state, city: values.city, pinCode: values.pinCode, logo: this.logo, img: this.img}).subscribe(
        result => {
          this.outPut = result;
          console.log("this.outPut=======>", this.outPut);
          if(this.outPut.resCode == 200){
            this.success = "true";
            this.errMsg = "";
            console.log("this.success=======", this.success);
            this.data2 = this.outPut.data;
            this.router.navigate(['/login']);
          }
          else{
            this.success = "";
            this.errMsg = "true";
            console.log("400=======");
          }
        }
      )

    }
  }


getPData: any;
data: any = {};
getAdminData(){
    this.http.post(this._com.baseUrl+'/getOneAdmin', {adminId: localStorage.getItem('adminId')}).subscribe( result => {
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
        this.router.navigate(['/master/all-doctor']);
      }
    })   
}


  stateData: any;
  cityData: any;
  dayData: any;
  docDecp: any;
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

  ngAfterViewInit(){
    this.settings.loadingSpinner = false; 
  }
}