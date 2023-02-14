import { Component, ViewChild, Inject, ElementRef } from '@angular/core';
import { Http, Headers, Response} from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
//import { TablesService, Element } from '../../tables/tables.service';
import { DialogComponent } from '../../ui/dialog/dialog.component';
import { CommonService } from '../../../common.service';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';

interface obj {
  resCode: number;
  resMsg: string;
  data: any;
  tokan: any;
}
interface arry1 {
  addedBy: any;
  updateBy: string;
  name: string;
  gender: string;
  dob: Date;
  mobileNo1: string;
  mobileNo2: string;
  city: string;
  state: string; 
  pinCode: number;
  _id: any;   
}

@Component({
  selector: 'app-bed-list',
  templateUrl: './one-doctor-opd-detail.component.html',
  styleUrls: ['./one-doctor-opd-detail.component.scss'],
  providers: [DialogComponent]
})
export class OneDoctorOpdDetailComponent {
@ViewChild('TABLE') table: ElementRef;
@ViewChild(MatPaginator) paginator: MatPaginator;
  public displayedColumns = ['No', 'Patient Name', 'Doctor Name', 'Mobile', 'Schedule', 'Token', 'Charges', 'Status'];
  public dataSource: any;
  public settings: Settings;
  constructor(public appSettings:AppSettings, private http: HttpClient, private router: Router, public dialog: MatDialog, public _com: CommonService, private activatedRoute : ActivatedRoute) {
    this.settings = this.appSettings.settings; 
    //this.dataSource = new MatTableDataSource<Element>(this.tablesService.getData());
    this.getAppointmentFromTodayToFuture();
  }
  outPut: any;
  getAppointmentFromTodayToFuture(){
  this.activatedRoute.params.subscribe(values => {
    console.log("values=====>", values);  
      this.http.post(this._com.baseUrl+'/getAllAppointmentByDoctor', {adminId: localStorage.getItem('adminId'), doctorId: values.id, date: values.date}).subscribe(
        result => {
          this.outPut = result;
          console.log("this.outPut===msg====>", this.outPut);
          if(this.outPut.resCode == 200){
            this.dataSource = new MatTableDataSource<Element[]>(this.outPut.data);
            this.dataSource.paginator = this.paginator;
          }
          else{
            console.log("400===e====");
          }
        }      
      )
    })      
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

ExportTOExcel()
{
  const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.table.nativeElement);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
  /* save to file */
  XLSX.writeFile(wb, 'Today-Doctor-OPD-Pay-list.xlsx');
  
}

}