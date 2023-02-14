import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { MenuService } from '../menu/menu.service';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { Http, Headers, Response} from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../common.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ MenuService ]
})
export class SidenavComponent implements OnInit {
  @ViewChild('sidenavPS') sidenavPS: PerfectScrollbarComponent;
  public userImage= '../assets/img/users/user.jpg';
  public logo= '../assets/img/users/logo.png';  
  public menuItems:Array<any>;
  public settings: Settings;
  constructor(public appSettings:AppSettings, public menuService:MenuService, public router:Router, private activatedRoute : ActivatedRoute, private http: HttpClient, public _com: CommonService){
      this.settings = this.appSettings.settings; 
      // this.hositalDetail();
  }

  ngOnInit() {
    this.menuItems = this.menuService.getVerticalMenuItems();
  }

  public closeSubMenus(){
    let menu = document.querySelector(".sidenav-menu-outer");
    if(menu){
      for (let i = 0; i < menu.children[0].children.length; i++) {
        let child = menu.children[0].children[i];
        if(child){
          if(child.children[0].classList.contains('expanded')){
              child.children[0].classList.remove('expanded');
              child.children[1].classList.remove('show');
          }
        }
      }
    }
  }

  logout(){
    localStorage.removeItem('adminId');
    console.log("admin logout successfully ...........");
  }

  public updatePS(e){
    this.sidenavPS.directiveRef.update();
  }


  hospitalD: any = {};
  hospitalD2: any = {};
  first: any;
  last: any;
  hositalDetail(){
      if(localStorage.getItem('adminId')){
        this.http.post(this._com.baseUrl+'/getOneAdmin', {adminId: localStorage.getItem('adminId')}).subscribe(
          result => {
            this.hospitalD = result;
            console.log("this.hospitalD=>", this.hospitalD);
            this.hospitalD2 = this.hospitalD.data;
            console.log("this.hospitalD2=>", this.hospitalD2);
            this.first = this.hospitalD2.hospitalName[0];
            this.last = this.hospitalD2.hospitalName.substring(this.hospitalD2.hospitalName.length,this.hospitalD2.hospitalName.length-1);
          }
        )  
      }
    else{
      this.router.navigate(['/login']);
    }
  }


}
