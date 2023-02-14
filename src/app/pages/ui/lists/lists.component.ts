import { Component, ViewChild, Inject, ElementRef } from '@angular/core';
import { Http, Headers, Response} from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TablesService, Element } from '../../tables/tables.service';
import { DialogComponent } from '../dialog/dialog.component';
import { CommonService } from '../../../common.service';
 import * as XLSX from 'xlsx';
 
interface obj {
  resCode: number;
  resMsg: string;
  data: any;
  tokan: any;
}
interface arry1 {
  doctorName: any;
  department: string;
  day: string;
  fromTime: string;
  toTime: Date; 
  _id: any;   
}

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss'],
  providers: [DialogComponent]
})
export class ListsComponent {
@ViewChild('TABLE') table: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public displayedColumns = ['No', 'Doctor Name', 'Department', 'Day', 'From Time', 'To Time', 'Action'];
  public dataSource: any;
  public settings: Settings;
  public currentPage: any;
  public totalSize: any;
  public pageSize: any;  
  outPut: any;
  data: arry1[];  
  
  constructor(public dialogComponent : DialogComponent, public appSettings:AppSettings, private tablesService:TablesService, private http: HttpClient, public router:Router, public _com: CommonService, public dialog: MatDialog) {
    this.settings = this.appSettings.settings; 
    // this.dataSource = new MatTableDataSource<Element>(this.tablesService.getData());
    this.getAllDoctorSchedule();
    this.currentPage = 0;
    this.pageSize = 10      
  }
  
  public getAllDoctorSchedule(){
    this.http.post(this._com.baseUrl+'/getAllDoctorSchedule', {adminId: localStorage.getItem('adminId')}).subscribe(
      result => {
        this.outPut = result;
        console.log("this.outPut===data====>", this.outPut.data);
        if(this.outPut.resCode == 200){
          this.dataSource = new MatTableDataSource<Element[]>(this.outPut.data);
          this.dataSource.paginator = this.paginator;
          // this.dataSource.filter = filterValue.trim().toLowerCase();
          // this.dataSource = new MatTableDataSource<Element>(this.data);
          // console.log("200===1====", this.dataSource.paginator);
          console.log("200dataSource2====", this.dataSource);
        }
        else{
          console.log("400===e====");
        }
      }      
    )
  }

  public handlePage(e: any) {
  console.log("===e====", e);
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    console.log("e.length------->",this.dataSource)
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
    XLSX.writeFile(wb, 'Doctor-Schedule.xlsx');
    
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


  deleteDoctorSchedule(idValue): void {
    const dialogRef = this.dialog.open(DeleteDoctorScheduleComponent, {
      width: '400px',
       data: { id: idValue}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getAllDoctorSchedule();
    });
  }
}



//--------------------------------------------------------delete-doctor-schedule---------------------------------------//

@Component({
  selector: 'app-delete-doctor-schedule',
  templateUrl: './delete-doctor-schedule.html',  
})

export class DeleteDoctorScheduleComponent {
  
  constructor( public dialogRef: MatDialogRef<DeleteDoctorScheduleComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public http: Http, public router: Router, public _com: CommonService){}

  deleteData: any;
  onNoClickDelete(idValue): void{
  console.log("idValue======>", idValue);
    this.http.post(this._com.baseUrl+'/deleteDoctorSchedule', {adminId: localStorage.getItem('adminId'), doctorScheduleId: idValue}).subscribe(
      result => {
        this.deleteData = result;
        console.log("this.deleteData======>", this.deleteData);
        if(this.deleteData.resCode == 200){
          this.dialogRef.close();
        }
        else{
           return false;
        }
      }
    )
  }
}   