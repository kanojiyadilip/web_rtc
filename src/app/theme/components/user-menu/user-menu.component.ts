import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute ,Params, Router } from '@angular/router';
import { Http, Headers, Response} from '@angular/http';
import { CommonService } from '../../../common.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UserMenuComponent implements OnInit {
  public userImage = '../assets/img/users/user.jpg';
  constructor(public router:Router, private activatedRoute : ActivatedRoute, private http: HttpClient, public _com: CommonService) {

    // this.hositalDetail();
  }

  ngOnInit() {
  }

  logout(){
   	localStorage.removeItem('adminId');
    this.router.navigate(['/login']);
   	console.log("admin logout successfully ...........");
  }

  hospitalD: any = {};
  hospitalD2: any = {};
  hositalDetail(){
      if(localStorage.getItem('adminId')){
        this.http.post(this._com.baseUrl+'/getOneAdmin', {adminId: localStorage.getItem('adminId')}).subscribe(
          result => {
            this.hospitalD = result;
            console.log("this.hospitalD=>", this.hospitalD);
            this.hospitalD2 = this.hospitalD.data;
            console.log("this.hospitalD2=>", this.hospitalD2);
          }
        )  
      }
    else{
      this.router.navigate(['/login']);
    }
  }


}
