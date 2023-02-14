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
  selector: 'update-diagnosis',
  templateUrl: './update-diagnosis.component.html',
  //imports: [ FormsModule ]
})
export class DiagnosisUpdateComponent {
 
  public form:FormGroup;
  public settings: Settings;
  outPut: any;
  constructor(public appSettings:AppSettings, public fb: FormBuilder, public router:Router, private http: HttpClient, private activatedRoute : ActivatedRoute, private atp: AmazingTimePickerService, public _com: CommonService){
    this.settings = this.appSettings.settings; 
    this.form = this.fb.group({
      'diagnosisName': [null, Validators.compose([Validators.required])],
      'abbreviation': [null, Validators.compose([Validators.required])],
      'diagnosisPrice': [null,[Validators.required, Validators.pattern(/^(0|[1-9]\d*)?$/)]]
    });

    this.getOneDiagnosis();
  }

  public onSubmit(values):void {
    console.log("values=+=+=+>", values);
    if (this.form.valid) {
      // this.router.navigate(['/']);
      this.http.post(this._com.baseUrl+'/updateDiagnosis', {adminId: localStorage.getItem('adminId'), diagnosisId: this.paramValue, diagnosisName: values.diagnosisName, abbreviation: values.abbreviation, diagnosisPrice: values.diagnosisPrice}).subscribe(
        result => {
          this.outPut = result;
          console.log("this.outPut=======>", this.outPut);
          if(this.outPut.resCode == 200){
            console.log("200=======");
            this.router.navigate(['/diagnosis/diagnosis-list']);
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
  getOneDiagnosis(){
  this.activatedRoute.params.subscribe(values => {
    console.log("values=====>", values);
    this.paramValue = values.id;
    console.log("values=====>", this.paramValue);
    this.http.post(this._com.baseUrl+'/getOneDiagnosis', {diagnosisId: this.paramValue}).subscribe( result => {
      this.getPData = result;
      console.log("this.getPData=====>", this.getPData);
      if(this.getPData.resCode == 200){
        this.data = this.getPData.data;
      }
      else if(this.getPData.resCode == 403){
        console.log("tokan is not provided");
      }
      else{
        this.router.navigate(['/diagnosis/diagnosis-list']);
      }
    })    
 });  
  }


  
}