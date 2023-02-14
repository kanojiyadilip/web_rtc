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
  selector: 'app-update-bed-category',
  templateUrl: './update-bed-category.component.html',
  //imports: [ FormsModule ]
})
export class BedCategoryUpdateComponent {
  public form:FormGroup;
  public settings: Settings;
  outPut: any;
  constructor(public appSettings:AppSettings, public fb: FormBuilder, public router:Router, private activatedRoute : ActivatedRoute, private http: HttpClient, private atp: AmazingTimePickerService, public _com: CommonService){
    this.settings = this.appSettings.settings; 
    this.form = this.fb.group({
      'categoryName': [null, Validators.compose([Validators.required])],
      'price': [null, Validators.compose([Validators.required,Validators.pattern(/^-?(0|[1-9]\d*)?$/)])],
    });

    this.getBedCategory();    
  }

  nuseDegree: any;
  experience: any;
  private doctorSchedule() {
    return this.fb.group({
      'drday': [null, Validators.compose([Validators.required])],
      'drfrom': [null, Validators.compose([Validators.required])],
      'drto': [null, Validators.compose([Validators.required])]
    });
  }

  private addRow() {
    const control = <FormArray>this.form.controls['schedules'];
    control.push(this.doctorSchedule());
  }

  private removeRow(i: number) {
    const control = <FormArray>this.form.controls['schedules'];
    control.removeAt(i);
  }


// Angular 2 encode image to base64

changeListener($event) : void {
  this.readThis($event.target);
}
 
 image: any;
readThis(inputValue: any): void {
  var file:File = inputValue.files[0];
  var myReader:FileReader = new FileReader();
  console.log("myReader==>", myReader);

  myReader.onloadend = (e) => {
    this.image = myReader.result;
    console.log("this.image==>", this.image);
  }
  myReader.readAsDataURL(file);
}  


paramValue: any;
getPData: any;
data: any = {};
drTimes: any;
getBedCategory(){
  this.activatedRoute.params.subscribe(values => {
    console.log("values=====>", values);
    this.paramValue = values.id;
    console.log("values=====>", this.paramValue);
    this.http.post(this._com.baseUrl+'/getOneBedCategory', {bedCategoryId: this.paramValue}).subscribe( result => {
      this.getPData = result;
      console.log("this.getPData=====>", this.getPData);
      if(this.getPData.resCode == 200){
        this.data = this.getPData.data;
      }
      else if(this.getPData.resCode == 403){
        console.log("tokan is not provided");
      }
      else{
        this.router.navigate(['/bed/bed-category-list']);
      }
    })    
 });    
}


  public fieldArray: Array<arrayItem> = [];
  public newAttribute: any = {};
  public onSubmit(values):void {
    console.log("values=+=+=+>", values);
    if (this.form.valid) {
      // this.router.navigate(['/']);
      this.http.post(this._com.baseUrl+'/updateBedCategory', {adminId: localStorage.getItem('adminId'), bedCategoryId: this.paramValue, categoryName: values.categoryName, price: values.price}).subscribe(
        result => {
          this.outPut = result;
          console.log("this.outPut=======>", this.outPut);
          if(this.outPut.resCode == 200){
            console.log("200=======");
            this.router.navigate(['/bed/bed-category-list']);
          }
          else{
            console.log("400=======");
            alert(this.outPut.resMsg);
          }
        }
      )
    }
  }

  selectedToTime: any;
  selectedFromTime: any;
  public timeObj: any={};
  open1() {
    const amazingTimePicker = this.atp.open();
    amazingTimePicker.afterClose().subscribe(time1 => {
      this.timeObj.from = time1;
      this.selectedFromTime = time1;
      console.log(time1);
    });
  }  

  open2() {
    const amazingTimePicker = this.atp.open();
    amazingTimePicker.afterClose().subscribe(time2 => {
      this.timeObj.to = time2;
      this.selectedFromTime = time2
      console.log(time2);
    });
  }  
 


  addFieldValue(){
      console.log("this.newAttribute=====>", this.newAttribute);
    this.fieldArray.push(this.newAttribute)
    console.log("this.fieldArray=====>", this.fieldArray);
  } 

  deleteFieldValue(index) {
    console.log("index=====>", index);
    this.fieldArray.splice(index, 1);
  } 
  
}