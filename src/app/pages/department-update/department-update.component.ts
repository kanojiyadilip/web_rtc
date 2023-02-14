import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';
import { Router, ActivatedRoute } from '@angular/router';
import { Http, Headers, Response} from '@angular/http';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { CommonService } from '../../common.service';
import { HttpClient } from '@angular/common/http';

interface obj {
    resCode: number;
    resMsg: string;
    data: any;
    tokan: any;
  }

@Component({
  selector: 'app-material-department-add',
  templateUrl: './department-update.component.html',
  styleUrls: ['./department-update.component.scss'],
})
export class DepartmentUpdateComponent implements OnInit {
  public form:FormGroup;
  public settings: Settings;
  outPut: any;
  constructor(public appSettings:AppSettings, private http: HttpClient, public router:Router, public fb: FormBuilder, private activatedRoute : ActivatedRoute, public _com: CommonService){
    this.settings = this.appSettings.settings;
    this.form = this.fb.group({
      'departmentName': [null, Validators.required]
    });
  }

  ngOnInit() {
  }
  
  paramValue: any;
  getPData: any;
  data: any = {};  
  getOnedepartment(){
    this.activatedRoute.params.subscribe(values => {
      this.paramValue = values.id;  
        this.http.post(this._com.baseUrl+'/getOnedepartment', {adminId: localStorage.getItem('adminId'), departmentId: this.paramValue}).subscribe(
          result => {
            this.getPData = result;
            console.log("this.getPData=====>", this.getPData);
            if(this.getPData.resCode == 200){
              this.data = this.getPData.data;
            }
            else if(this.getPData.resCode == 403){
              console.log("tokan is not provided");
            }
            else{
              this.router.navigate(['/department']);
            }
        })  
    })
  }

  public onSubmit(value):void {
    console.log("value=>",value);
    if (this.form.valid) {
      this.http.post(this._com.baseUrl+'/updateDepartment ', {adminId: localStorage.getItem('adminId'), departmentName: value.departmentName, departmentId: this.paramValue}).subscribe(
        result => {
          this.outPut = result;
          console.log("this.outPut=>",this.outPut);
          console.log("this.outPut=======>", this.outPut);
          if(this.outPut.resCode == 200){
            console.log("200=======");
            this.router.navigate(['/department']);
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
