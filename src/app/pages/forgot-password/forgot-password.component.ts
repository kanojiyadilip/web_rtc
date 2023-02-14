import { Component, ViewChild, ElementRef } from '@angular/core';
import { Http, Headers, Response} from '@angular/http';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { emailValidator } from '../../theme/utils/app-validators';
import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';
import { CommonService } from '../../common.service';

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
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent {
  @ViewChild('alert') alert: ElementRef;

  closeAlert() {
    this.alert.nativeElement.classList.remove('show');
    this.errMsg = "";
  }  
  public form:FormGroup;
  public settings: Settings;
  outPut: obj;
  data: obj1;
  success: any = "";
  constructor(public appSettings:AppSettings, public fb: FormBuilder, public router:Router, private http: Http, public _com: CommonService){
    this.settings = this.appSettings.settings; 
    this.form = this.fb.group({
      'email': [null, Validators.compose([Validators.required, emailValidator])]
    });

    this.auth();
  }

  errMsg: string= "";
  public onSubmit(values):void {
    if (this.form.valid) {
      // this.router.navigate(['/']);
      this.http.post(this._com.baseUrl+'/adminForgotPassword', {emailId: values.email}).subscribe(
        result => {
          this.outPut = result.json();
          console.log("this.outPut=======>", this.outPut);
          if(this.outPut.resCode == 200){
            this.success = "true";
            this.errMsg = "";
            console.log("this.success=======", this.success);
            this.data = this.outPut.data;
            //this.router.navigate(['/']);
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

  auth(){
    if(localStorage.getItem('adminId')){
      this.router.navigate(['/']);
      }
  }

  ngAfterViewInit(){
    this.settings.loadingSpinner = false; 
  }
}