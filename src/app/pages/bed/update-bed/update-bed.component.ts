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
  selector: 'app-update-bed',
  templateUrl: './update-bed.component.html',
  //imports: [ FormsModule ]
})
export class BedUpdateComponent {
  public form:FormGroup;
  public settings: Settings;
  outPut: any;
  constructor(public appSettings:AppSettings, public fb: FormBuilder, public router:Router, private activatedRoute : ActivatedRoute, private http: HttpClient, private atp: AmazingTimePickerService, public _com: CommonService){
    this.settings = this.appSettings.settings; 
    this.form = this.fb.group({
      'bedCategoryId': [null, Validators.compose([Validators.required])],
      'bedNo': [null, Validators.compose([Validators.required])],
    });


    this.getAllBedCategory();
    this.getOneBed();
    // this.city();   
  }

  paramValue: any;
  getPData: any;
  data: any = {};
  drTimes: any;
  getOneBed(){
    this.activatedRoute.params.subscribe(values => {
      console.log("values=====>", values);
      this.paramValue = values.id;
      console.log("values=====>", this.paramValue);
      this.http.post(this._com.baseUrl+'/getOneBed', {bedId: this.paramValue}).subscribe( result => {
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
          this.router.navigate(['/bed/bed-list']);
        }
      })    
   });    
  }

  public onSubmit(values):void {
    console.log("values=+=+=+>", values);
    if (this.form.valid) {
      // this.router.navigate(['/']);
      this.http.post(this._com.baseUrl+'/updateBed', {adminId: localStorage.getItem('adminId'), bedId: this.paramValue,  categoryName: values.bedCategoryId, bedNo: values.bedNo}).subscribe(
        result => {
          this.outPut = result;
          console.log("this.outPut=======>", this.outPut);
          if(this.outPut.resCode == 200){
            console.log("200=======");
            this.router.navigate(['/bed/bed-list']);
          }
          else{
            console.log("400=======");
            alert(this.outPut.resMsg);
          }
        }
      )
    }
  }


//   stateDatas: any;
  bedcd: any;
  cityData: any;
  dayData: any;
  docDecp: any;
  getAllBedCategory(){
    this.http.post(this._com.baseUrl+'/getAllBedCategory', {adminId: localStorage.getItem('adminId')}).subscribe( result => {

      this.bedcd = result;
      console.log("bedcd==>", this.bedcd);
    })
  }
  
 
  select(stateid){
    console.log("stateid----->", stateid);
    this.http.post("https://node-pos.herokuapp.com/city", {state: stateid}).subscribe(result =>{
    this.cityData = result;
    console.log("this.cityData----->", this.cityData);
   })      
  } 
  
}