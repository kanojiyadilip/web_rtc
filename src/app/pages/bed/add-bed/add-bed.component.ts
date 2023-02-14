import { Component } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormArray } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Http, Headers, Response} from '@angular/http';
import { Router } from '@angular/router';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { HttpClient } from '@angular/common/http';
import { CommonService } from '../../../common.service';

interface obj {
    resCode: number;
    resMsg: string;
    data: any;
    tokan: any;
  } 

@Component({
  selector: 'add-bed',
  templateUrl: './add-bed.component.html',
  //imports: [ FormsModule ]
})
export class BedAddComponent {

  public form:FormGroup;
  public settings: Settings;
  outPut: any;
  constructor(public appSettings:AppSettings, public fb: FormBuilder, public router:Router, private http: HttpClient, public _com: CommonService){
    this.settings = this.appSettings.settings; 
    this.form = this.fb.group({
      'bedCategoryId': [null, Validators.compose([Validators.required])],
      'bedNo': [null, Validators.compose([Validators.required])],
    });

    this.getBedCat();
  }

  public onSubmit(values):void {
    console.log("values=+=+=+>", values);
    if (this.form.valid) {
      // this.router.navigate(['/']);
      this.http.post(this._com.baseUrl+'/createBed', {adminId: localStorage.getItem('adminId'), bedCategoryId: values.bedCategoryId, bedNo: values.bedNo, dob: values.dob}).subscribe(
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

  bedcd: any;
  getBedCat(){
    this.http.post(this._com.baseUrl+'/getAllBedCategory', {adminId: localStorage.getItem('adminId')}).subscribe( result => {

      this.bedcd = result;
      console.log("bedcd==>", this.bedcd);
    })
  }
  
}