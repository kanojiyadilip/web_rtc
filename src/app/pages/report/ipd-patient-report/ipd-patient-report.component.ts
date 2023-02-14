import { Component, ViewChild, OnInit, Inject, ElementRef } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormArray } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { Http, Headers, Response} from '@angular/http';
import { Router } from '@angular/router';
import { CommonService } from '../../../common.service';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';

interface obj {
    resCode: number;
    resMsg: string;
    data: any;
    overAll: any;
    tokan: any;
  }

export interface patient {
  name: string;
  _id: string;
}

@Component({
  selector: 'app-ipd-patient-report',
  templateUrl: './ipd-patient-report.component.html',
  styleUrls: ['./ipd-patient-report.component.scss']
})
export class IpdPatientReportComponent implements OnInit {

  @ViewChild('TABLE') table: ElementRef;
  //@ViewChild(MatPaginator) paginator: MatPaginator;
  public displayedColumns = ['No', 'patientName', 'patientTokenInvNo', 'admitDate', 'dischargeDate', 'totalCharges', 'patientStatus'];
  public dataSource: any;


  public form:FormGroup;
  outPut: any;

  constructor(public fb: FormBuilder, public router:Router, private http: HttpClient, public _com: CommonService) { 

  	this.form = this.fb.group({
  		'fromDate': [null, Validators.compose([Validators.required])],
  		'toDate': [null, Validators.compose([Validators.required])],
      	'ipdPatientId': ''
  	})

  	//this.getAllDoctor();
    this.getAllOpdPatient();
  }

  //myControl = new FormControl();
  OpdPatient: patient[];
  filteredOptionsPatient: Observable<patient[]>;
  ngOnInit() {
    this.filteredOptionsPatient = this.form.controls['ipdPatientId'].valueChanges
      .pipe(
        startWith<string | patient>(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.OpdPatient)
      );
  }


  displayFn(user?: patient): string | undefined {
    return user ? user.name : undefined;
  }

  private _filter(name: string): patient[] {
  	console.log("name---1--->", name);
    const filterValue = name.toLowerCase();
    console.log("this.OpdPatient---2--->", this.OpdPatient);
    return this.OpdPatient.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }
 

   allOpdPatient: any;
   
   getAllOpdPatient(){
    this.http.post(this._com.baseUrl+'/getAllPatientDetail', {adminId: localStorage.getItem('adminId')}).subscribe(
      result => {
        this.allOpdPatient = result;
        console.log("this.allPatient=>", this.allOpdPatient);
        this.OpdPatient = this.allOpdPatient.data;
      }
    )
   } 


 	dataSize: any;
  overAllTotal: any;
	public onSubmit(value):void {
		console.log("value------->", value);
		if (this.form.valid) {
			this.http.post(this._com.baseUrl+'/patientReport', {adminId: localStorage.getItem('adminId'), ipdPatientId: value.ipdPatientId, fromDate: value.fromDate, toDate: value.toDate}).subscribe(result=> {this.outPut = result;
				console.log("this.outPut=======>", this.outPut);
	        if(this.outPut.resCode == 200){
	          this.dataSource = new MatTableDataSource<Element[]>(this.outPut.data); 
	          //this.dataSource.paginator = this.paginator;
	          this.dataSize = this.outPut.data.length;
            	  this.overAllTotal = this.outPut.overAll;
	        }
	        else{
	        	alert(this.outPut.resMsg);
	        	return false;
	        }   				
			})
		}
	}

  footer: string = 'true';
  applyFilter(filterValue: string) {
    if(filterValue !== ''){
      this.footer = 'false';
    }
    else{
      this.footer = 'true';
    }   
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ExportTOExcel()
  {
    const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    
    /* save to file */
    XLSX.writeFile(wb, 'Appointment-report.xlsx');
    
  }

  showElement: boolean;
  printToPdf(tablePrint){
    const printContent = document.getElementById(tablePrint);
    const WindowPrt = window.open('', '', 'left=0,top=0,width=600,height=800,toolbar=0,scrollbars=0,status=0');
    //const is_chrome = Boolean(WindowPrt.chrome);
    WindowPrt.document.write(printContent.innerHTML);
    WindowPrt.document.close();
    this.showElement = true;
    setTimeout(() => {
      WindowPrt.focus();
      WindowPrt.print();
      WindowPrt.close(); 
      this.showElement = false;
    }, 1000);         
  }

}
