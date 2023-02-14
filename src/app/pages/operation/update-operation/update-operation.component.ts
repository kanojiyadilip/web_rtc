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

@Component({
  selector: 'update-operation',
  templateUrl: './update-operation.component.html',
  //imports: [ FormsModule ]
})
export class OperationUpdateComponent {
 
  public form:FormGroup;
  public settings: Settings;
  outPut: any;
  constructor(public appSettings:AppSettings, public fb: FormBuilder, public router:Router, private http: HttpClient, private activatedRoute : ActivatedRoute, private atp: AmazingTimePickerService, public _com: CommonService){
    this.settings = this.appSettings.settings; 
    this.form = this.fb.group({
      'operationName': [null, Validators.compose([Validators.required])],
      'abbreviation': [null, Validators.compose([Validators.required])],
      'operationCharges': [null,[Validators.required, Validators.pattern(/^(0|[1-9]\d*)?$/)]]
    });

    this.getOneOperation();
  }

  public onSubmit(values):void {
    console.log("values=+=+=+>", values);
    if (this.form.valid) {
      // this.router.navigate(['/']);
      this.http.post(this._com.baseUrl+'/updateOperation', {adminId: localStorage.getItem('adminId'), operationId: this.paramValue, operationName: values.operationName, abbreviation: values.abbreviation, operationCharges: values.operationCharges}).subscribe(
        result => {
          this.outPut = result;
          console.log("this.outPut=======>", this.outPut);
          if(this.outPut.resCode == 200){
            console.log("200=======");
            this.router.navigate(['/operation/operation-list']);
          }
          else{
            console.log("400=======");
          }
        }
      )
    }
  }

  getPData: any;
  paramValue: any;
  data: any={};
  getOneOperation(){
  this.activatedRoute.params.subscribe(values => {
    console.log("values=====>", values);
    this.paramValue = values.id;
    console.log("values=====>", this.paramValue);
    this.http.post(this._com.baseUrl+'/getOneOperation', {operationId: this.paramValue}).subscribe( result => {
      this.getPData = result;
      console.log("this.getPData=====>", this.getPData);
      if(this.getPData.resCode == 200){
        this.data = this.getPData.data;
      }
      else if(this.getPData.resCode == 403){
        console.log("tokan is not provided");
      }
      else{
        this.router.navigate(['/operation/operation-list']);
      }
    })    
 });  
  }


  
}