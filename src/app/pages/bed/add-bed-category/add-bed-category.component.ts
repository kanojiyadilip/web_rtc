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
  selector: 'add-bed-category',
  templateUrl: './add-bed-category.component.html',
  //imports: [ FormsModule ]
})
export class BedCategoryAddComponent {

  public form:FormGroup;
  public settings: Settings;
  outPut: any;
  constructor(public appSettings:AppSettings, public fb: FormBuilder, public router:Router, private http: HttpClient, private atp: AmazingTimePickerService, public _com: CommonService){
    this.settings = this.appSettings.settings; 
    this.form = this.fb.group({
      'categoryName': [null, Validators.compose([Validators.required])],
      'price': [null, Validators.compose([Validators.required,Validators.pattern(/^-?(0|[1-9]\d*)?$/)])],
    });
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

  public onSubmit(values):void {
    console.log("values=+=+=+>", values);
    if (this.form.valid) {
      // this.router.navigate(['/']);
      this.http.post(this._com.baseUrl+'/createBedCategory', {adminId: localStorage.getItem('adminId'), categoryName: values.categoryName, price: values.price}).subscribe(
        result => {
          this.outPut = result;
          console.log("this.outPut=======>", this.outPut);
          if(this.outPut.resCode == 200){
            console.log("200=======");
            this.router.navigate(['/bed/bed-category-list']);
          }
          else{
            console.log("400=======");
          }
        }
      )
    }
  }
  
}