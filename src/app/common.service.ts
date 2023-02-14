import { Injectable, OnInit } from '@angular/core';
import 'rxjs/Rx';
import { HttpClient, HttpParams, HttpHeaders,HttpUrlEncodingCodec, HttpEventType } from "@angular/common/http";
import { Router } from '@angular/router';
import { map } from  'rxjs/operators';

const APIURL = 'http://localhost:3001';
// const APIURL = 'https://chatdk.herokuapp.com';
@Injectable({
  providedIn: 'root'
})
export class CommonService {

  // constructor() { }

  doctorDegree = ['MBBS', 'BDS', 'BHMS', 'BAMS', 'DHMS', 'BUMS', 'BVSc & AH', 'BOT', 'BMLT', 'BPT', 'B.Sc. Nursing', 'BNYS'];
  nuseDegree = ['ANM', 'GNM', 'B.Sc. (Basic)', 'B.Sc. (Post Basic)', 'M.Phil', 'PhD', 'CNS', 'NP', 'CNM', 'CRNA', 'B.Sc. Nursing', 'Other'];  
  experience = ['1yr', '2yr', '3yr', '4yr', '5yr', '6yr', '7yr', '8yr', '9yr', '10yr', '11yr', '12yr', '13yr', '14yr', 'more then 15 yr'];
  bloodGroup = ['A+', 'O+', 'B+', 'AB+', 'A-', 'O-', 'B-', 'AB-'];

  // baseurl: any = APIURL;
  currentUser = {};
  headers;
  org_id = '';  

  constructor(private httpClient: HttpClient,  private router: Router) { }

  baseUrl: any = APIURL;
  ngOnInit() {
    // console.log('api init');
    this.currentUser = JSON.parse(localStorage.getItem('chatuser'));
    // console.log("this.currentUser['_id']----", this.currentUser)
    this.headers = new  HttpHeaders().set("user_id", this.currentUser['_id'])
                                     .set("token",this.currentUser['token'])
                                     .set("Content-Type", "application/x-www-form-urlencoded");
    this.org_id = this.currentUser['org_id'] || '';
  }  

  login(data) {
      this.headers = new  HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded");
      return this.httpClient.post(`${APIURL}/api/users/login`,data).map(response => { return response });
  }

  logout(data) {
    localStorage.removeItem('chatuser');
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  getAllUserByUser(data) {
    this.headers = new  HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded");
    return this.httpClient.post(`${APIURL}/api/users/get_all_users`,data).map(response => { return response });
  }  

  addUser(data) {
    this.headers = new  HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded");
    return this.httpClient.post(`${APIURL}/api/users/add_user`,data).map(response => { return response });
  }

  searchUser(data){
    this.headers = new  HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded");
    return this.httpClient.post(`${APIURL}/api/users/search_user`,data).map(response => { return response });    
  }


  socialLogin(data){
    this.headers = new  HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded");
    const body = new HttpParams()
                .set('email', data.email)
                .set('name', data.name)
                .set('provider', data.provider)
                .set('provider_token', data.token)
                .set('provider_id', data.id)
                .set('profile_pic', data.image)
    return this.httpClient.post(`${APIURL}/api/users/social_login`,body.toString(),{headers: this.headers}).map(response => { return response });

  }

}
