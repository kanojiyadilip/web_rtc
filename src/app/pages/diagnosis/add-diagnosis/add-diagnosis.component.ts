import { Component } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormArray } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Http, Headers, Response} from '@angular/http';
import { Router } from '@angular/router';
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
  selector: 'add-diagnosis',
  templateUrl: './add-diagnosis.component.html',
  //imports: [ FormsModule ]
})
export class DiagnosisAddComponent {
 
  public form:FormGroup;
  public settings: Settings;
  outPut: any;
  constructor(public appSettings:AppSettings, public fb: FormBuilder, public router:Router, private http: HttpClient, private atp: AmazingTimePickerService, public _com: CommonService){
    this.settings = this.appSettings.settings; 
    this.form = this.fb.group({
      'diagnosisName': [null, Validators.compose([Validators.required])],
      'abbreviation': [null, Validators.compose([Validators.required])],
      'diagnosisPrice': [null,[Validators.required, Validators.pattern(/^(0|[1-9]\d*)?$/)]]
    });
  }

  public onSubmit(values):void {
    console.log("values=+=+=+>", values);
    if (this.form.valid) {
      // this.router.navigate(['/']);
      this.http.post(this._com.baseUrl+'/createDiagnosis', {adminId: localStorage.getItem('adminId'), diagnosisName: values.diagnosisName, abbreviation: values.abbreviation, diagnosisPrice: values.diagnosisPrice}).subscribe(
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


  
}