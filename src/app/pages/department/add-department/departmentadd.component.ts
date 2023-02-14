import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { Router, ActivatedRoute } from '@angular/router';
import { Http, Headers, Response} from '@angular/http';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { CommonService } from '../../../common.service';
import { HttpClient } from '@angular/common/http';

interface obj {
  resCode: number;
  resMsg: string;
  data: any;
  tokan: any;
}

@Component({
  selector: 'app-material-department-add',
  templateUrl: './departmentadd.component.html',
  styleUrls: ['./departmentadd.component.scss'],
})
export class DepartmentAddComponent implements OnInit {
  public form:FormGroup;
  public settings: Settings;
  outPut: any;
  constructor(public appSettings:AppSettings, private http: HttpClient, public router:Router, public fb: FormBuilder, public _com: CommonService){
    this.settings = this.appSettings.settings;
    this.form = this.fb.group({
      'departmentName': [null, Validators.compose([Validators.required])],
      'departmentAbbreviationName': [null, Validators.compose([Validators.required])]
    });
  }

  ngOnInit() {
  }
  
  public onSubmit(value):void {
    console.log("value=>",value);
    if (this.form.valid) {
      this.http.post(this._com.baseUrl+'/createDepartment', {adminId: localStorage.getItem('adminId'), departmentName: value.departmentName, departmentAbbreviationName: value.departmentAbbreviationName}).subscribe(
        result => {
          this.outPut = result;
          console.log("this.outPut=>",this.outPut);
          console.log("this.outPut=======>", this.outPut);
          if(this.outPut.resCode == 200){
            console.log("200=======");
            this.router.navigate(['/department/department-list']);
          }
          else{
            console.log("400=======");
            alert(this.outPut.resMsg);
          }
        }
      )
    }
  }

}
