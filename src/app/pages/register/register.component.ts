import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, Response} from '@angular/http';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { emailValidator, matchingPasswords } from '../../theme/utils/app-validators';
import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';
import { CommonService } from '../../common.service';
import { style } from '@angular/animations';

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
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  public form:FormGroup;
  public settings: Settings;
  public hide = true;
  public hide2 = true;
  constructor(public appSettings:AppSettings, public fb: FormBuilder, public router:Router, private http: Http, public _com: CommonService){
    this.settings = this.appSettings.settings; 
    this.form = this.fb.group({
      // 'hospitalName': [null, Validators.required],
      'name': [null, Validators.compose([Validators.required, Validators.minLength(3)])],
      'email': [null, Validators.compose([Validators.required, emailValidator])],
      'password': ['', Validators.required],
      'confirmPassword': ['', Validators.required]
    },{validator: matchingPasswords('password', 'confirmPassword')});

    this.auth();
  }
  
  outPut: obj;
  data: obj1;
  errMsg: string= "";
  success: string= "";
  apiMsg: any;
  btnDisable: boolean = false;
  defaultUser: string = 'assets/img/profile/default_user.png'

  public onSubmit(values):void {
    if (this.form.valid) {
      //this.router.navigate(['/login']);
      this.btnDisable = true;
      this._com.addUser({password: values.confirmPassword, name: values.name, email: values.email, profile_pic: this.image}).subscribe(data => {
        if(data['code'] == 200){
          this.success = "true";
          this.btnDisable = false;
          this.apiMsg = data['msg'];
          this.router.navigate(['/login']);
        }
        else{
          this.errMsg = "true";
          this.btnDisable = false;
          this.apiMsg = data['msg'];
        }
      })
      // this.http.post(this._com.baseUrl+'/signUp', {password: values.confirmPassword, name: values.name, emailId: values.email, hospitalName: values.hospitalName}).subscribe(
      //   result => {
      //     this.outPut = result.json();
      //     console.log("this.outPut=======>", this.outPut);
      //     if(this.outPut.resCode == 200){
      //       this.success = "true";
      //       this.errMsg = "";
      //       alert('Admin Password Change Successfully')
      //       console.log("this.success=======", this.success);
      //       this.data = this.outPut.data;
      //       this.router.navigate(['/login']);
      //     }
      //     else{
      //       this.success = "";
      //       this.errMsg = "true";
      //       console.log("400=======");
      //     }
      //   }
      // )

    }
  }

  auth(){
    if(localStorage.getItem('adminId')){
      this.router.navigate(['/']);
      }
  }

  ngAfterViewInit(){
    this.settings.loadingSpinner = false; 
  }

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
}