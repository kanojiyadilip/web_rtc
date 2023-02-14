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
    totalCharges: any;
    tokan: any;
  }

export interface patient {
  name: string;
  _id: string;
}


@Component({
  selector: 'app-diagnosis-report',
  templateUrl: './diagnosis-report.component.html',
  styleUrls: ['./diagnosis-report.component.scss']
})
export class DiagnosisReportComponent implements OnInit {

  @ViewChild('TABLE') table: ElementRef;
  //@ViewChild(MatPaginator) paginator: MatPaginator;
  public displayedColumns = ['No', 'DoctorName', 'ipdPatinetName', 'diagnosisName', 'charges'];
  public dataSource: any;


  public form:FormGroup;
  outPut: any;

  constructor(public fb: FormBuilder, public router:Router, private http: HttpClient, public _com: CommonService) { 

  	this.form = this.fb.group({
  		'fromDate': [null, Validators.compose([Validators.required])],
  		'toDate': [null, Validators.compose([Validators.required])],
  		'doctorId': ''
  	})

  	this.getAllDoctor();
  }

  //myControl = new FormControl();
  OpdPatient: patient[];
  filteredOptionsPatient: Observable<patient[]>;
  ngOnInit() {

  }

   allDoctor: any;
   getAllDoctor(){
    this.http.post(this._com.baseUrl+'/getAllDoctor', {adminId: localStorage.getItem('adminId')}).subscribe(
      result => {
        this.allDoctor = result;
        console.log("this.allDoctor=>", this.allDoctor);
      }
    )
   } 
 

 	dataSize: any;
  overAllTotal: any;
	public onSubmit(value):void {
		console.log("value------->", value);
		if (this.form.valid) {
			this.http.post(this._com.baseUrl+'/diagnosisReport', {adminId: localStorage.getItem('adminId'), doctorId: value.doctorId, fromDate: value.fromDate, toDate: value.toDate}).subscribe(result=> {this.outPut = result;
				console.log("this.outPut=======>", this.outPut);
	        if(this.outPut.resCode == 200){
	          this.dataSource = new MatTableDataSource<Element[]>(this.outPut.data); 
	          //this.dataSource.paginator = this.paginator;
	          this.dataSize = this.outPut.data.length;
            this.overAllTotal = this.outPut.totalCharges;
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
    XLSX.writeFile(wb, 'Diagnosis-report.xlsx');
    
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
