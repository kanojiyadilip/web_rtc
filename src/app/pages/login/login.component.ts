import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
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
  token: any;
}
interface obj1 {
  _id: any;
  name: string;
  emailId: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  @ViewChild('alert') alert: ElementRef;

  closeAlert() {
    this.alert.nativeElement.classList.remove('show');
    this.errMsg = "";
  }  
  public form:FormGroup;
  public settings: Settings;
  outPut: obj;
  data: obj1;
  apiMsg: any;
  public hide = true;
  public logo: string = 'assets/img/logo/logo.svg';
  constructor(public appSettings:AppSettings, public fb: FormBuilder, public router:Router, private http: Http, public _com: CommonService){
    this.settings = this.appSettings.settings; 
    this.form = this.fb.group({
      'email': [null, Validators.compose([Validators.required, emailValidator])],
      'password': [null, Validators.compose([Validators.required, Validators.minLength(6)])] 
    });

    this.auth();
  }


  ngOnInit() {

    setTimeout(()=>{
      this.glogin();
    },1)
  }  

  errMsg: string= "";
  public onSubmit(values):void {
    if (this.form.valid) {
      
        this._com.login({username: values.email, password: values.password}).subscribe(
          data => {
            console.log("POST Request is successful ", data);
            if (data['code'] == 200) {
              // console.log(data['code'],data['data']['role']);
              localStorage.setItem('chatuser', JSON.stringify(data['data'])); 
              localStorage.setItem('adminId', data['data']['_id']);
              localStorage.setItem('token', data['data']['token']);
              this.router.navigate(['/chat']);
            }
          else{
            this.errMsg = "true";
            this.apiMsg = data['msg'];
            console.log("400=======");
          }            
        });


      // localStorage.setItem('adminId', "adminId");
      // localStorage.setItem('token', "token");
      // this.http.post(this._com.baseUrl+'/loginAdmin', {emailId: values.email, password: values.password}).subscribe(
      //   result => {
      //     this.outPut = result.json();
      //     console.log("this.outPut=======>", this.outPut);
      //     if(this.outPut.resCode == 200){
      //       console.log("200=======");
      //       this.data = this.outPut.data;
      //       localStorage.setItem('adminId', this.data._id);
      //       localStorage.setItem('token', this.outPut.token);
            this.router.navigate(['/']);
      //     }
      //     else{
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

// ==========================================================================================

  glogin(){
    // @ts-ignore
    google.accounts.id.initialize({
      client_id: "826078489591-hctjik0k5rfmugf31il2hdliqavec9an.apps.googleusercontent.com",
      callback: this.handleCredentialResponse.bind(this),
      auto_select: false,
      cancel_on_tap_outside: false,
  
    });
    // @ts-ignore
    google.accounts.id.renderButton(
    // @ts-ignore
    document.getElementById("google-button"),
      { theme: "outline", size: "large", width: "100%" }
    );
    // @ts-ignore
    google.accounts.id.prompt((notification: PromptMomentNotification) => {});
  }

  async handleCredentialResponse(response: any) {
    // Here will be your response from Google.
    console.log(response);
    console.log(this.parseJwt(response.credential))
    let userData = this.parseJwt(response.credential);

    this.socialSignIn('google', {...userData, provider_token: response.credential});

  }

  parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } 

  // socialLogin(data){
  //   this.headers = new  HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded");
  //   const body = new HttpParams()
  //               .set('email', data.email)
  //               .set('name', data.name)
  //               .set('provider', data.provider)
  //               .set('provider_token', data.token)
  //               .set('provider_id', data.id)
  //               .set('profile_pic', data.image)
  //   return this.httpClient.post(`${APIURL}/users/social_login`,body.toString(),{headers: this.headers}).map(response => { return response });

  // }

  public socialSignIn(socialPlatform : string, userData: any) {
    let socialPlatformProvider;
    // if(socialPlatform == "facebook"){
    //   socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    // }else if(socialPlatform == "google"){
    //   socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    // } 
    // var thisVar = this;
    // this.socialAuthService.signIn(socialPlatformProvider).then(
    //   (userData) => {
        console.log(socialPlatform+" sign in data : " , userData);
        var body = {
          email : userData.email,
          id : userData.id,
          name : userData.name,
          provider : socialPlatform,
          token : userData.provider_token,
          image : userData.picture,
          provider_token: userData.provider_token
        }
        if(socialPlatform == "google"){
          body['token'] = userData.provider_token;
        }
        var toogleAlert;
        // thisVar.userService.showToogleAlert('Processing', 'process','init',(res)=>{
        //   toogleAlert = res;
        // });
        this._com.socialLogin(body).subscribe(
          data => {
            console.log("POST Request is successful ", data);
            if (data['code'] == 200) {
              console.log(data['code'],data['data']['role']);
              // localStorage.setItem('chatDKuser', JSON.stringify(data['data']));

              localStorage.setItem('chatuser', JSON.stringify(data['data'])); 
              localStorage.setItem('adminId', data['data']['_id']);
              localStorage.setItem('token', data['data']['token']);
              this.router.navigate(['/chat']);

              // toogleAlert.componentInstance.subtype = 'done';
              // toogleAlert.componentInstance.title = 'Done';
              // setTimeout(function () {
              //   toogleAlert.close();
              // }, 2000);
              this.router.navigate(['/']);
            } else {
              toogleAlert.componentInstance.subtype = 'failed';
              toogleAlert.componentInstance.title = data['msg'];
              setTimeout(function () {
                toogleAlert.close();
              }, 5000);
            }
          },
          error => {
            console.log('<------------ERROR------------->')
            toogleAlert.componentInstance.subtype = 'failed';
            toogleAlert.componentInstance.title = 'Failed to reach server';
            setTimeout(function () {
                toogleAlert.close();
            }, 5000);
            return error;
          }
        );
            
    //   }
    // );
  }
  
}