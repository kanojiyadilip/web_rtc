import { Component, ViewChild, ElementRef } from '@angular/core';
import { Http, Headers, Response} from '@angular/http';
import { ActivatedRoute ,Params, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { emailValidator, matchingPasswords } from '../../theme/utils/app-validators';
import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';
import { CommonService } from '../../common.service';
//declare let swal: any;

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
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent {
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
  constructor(public appSettings:AppSettings, public fb: FormBuilder, public router:Router, private http: Http, public _com: CommonService, public activatedRoute : ActivatedRoute){
    this.settings = this.appSettings.settings; 
    this.form = this.fb.group({
      'password': ['', Validators.required],
      'confirmPassword': ['', Validators.required]
    },{validator: matchingPasswords('password', 'confirmPassword')});

    this.auth();
    this.CheckaPermission();
  }

  errMsg: string= "";
  public onSubmit(values):void {
    console.log("values------->", values);
    if (this.form.valid) {
      // this.router.navigate(['/']);
      this.http.post(this._com.baseUrl+'/changePwd/'+this.tokenValue, {newPassword: values.confirmPassword}).subscribe(
        result => {
          this.outPut = result.json();
          console.log("this.outPut=======>", this.outPut);
          if(this.outPut.resCode == 200){
            this.success = "true";
            this.errMsg = "";
            alert('Admin Password Change Successfully')
            console.log("this.success=======", this.success);
            this.data = this.outPut.data;
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


  public tokenValue:string;
  public changePsswordToekn:any;
  public outPutPass: any;
  CheckaPermission(){

        this.tokenValue = '';
        this.activatedRoute.params.subscribe(values => {
          console.log('values++++&&&&+++++>', values);
          this.tokenValue = values.token;
          console.log("this.tokenValue---******---> ",this.tokenValue);
          localStorage.setItem('tokenValue', this.tokenValue);
            this.http.get(this._com.baseUrl+'/changePassPermission/'+this.tokenValue).subscribe(result=>{
               this.outPutPass = result.json();
               console.log("this.outPutPass===1===> ",this.outPutPass);
              if(this.outPutPass.resCode == 200){
                console.log("this.outPutPass=2=====> ",this.outPutPass);
              }
              else if(this.outPutPass.resCode == 400 || this.outPutPass.resCode == 500){
                //this.flashMessagesService.show( this.outPutPass.resMsg , {cssClass: 'alert-danger', timeout: 5000 });
                console.log("this.outPutPass======> ",this.outPutPass);
                //this.showAlert();
                this.router.navigate(['/login']);
                //alert(this.outPutPass.resMsg);
                //window.location.href = '/login';
              }       
            })          
      });

      this.changePsswordToekn = localStorage.getItem('tokenValue');
      if(this.changePsswordToekn !== null || this.changePsswordToekn !== '' || this.changePsswordToekn == 'undefind')
      {
        //this.changePsswordToekn = localStorage.getItem('tokenValue');
        this.changePsswordToekn = 1234567890;
      }
      else {
         this.changePsswordToekn = null;
      }

  }


  auth(){
    if(localStorage.getItem('adminId')){
      this.router.navigate(['/']);
      }
  }

  /*showAlert() {
    swal({
      title: 'Authentication Failed!',
      text: "You not Authenticated",
      type: 'warning',
    }).then(function() {
      swal(
        'Deleted!',
        'Your file has been deleted.',
        'success'
      );
    })
    this.router.navigate(['/login']);
    //window.location.href = '/login';
  }*/



  ngAfterViewInit(){
    this.settings.loadingSpinner = false; 
  }
}