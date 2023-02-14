import { Component, ViewChild, Inject, ElementRef } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
//import { TablesService, Element } from '../tables.service';
import { Http, Headers, Response} from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CommonService } from '../../../common.service';
 import * as XLSX from 'xlsx';

interface obj {
  resCode: number;
  resMsg: string;
  data: any;
  tokan: any;
}

@Component({
  selector: 'app-slide-toggle',
  templateUrl: './slide-toggle.component.html',
  styleUrls: ['./slide-toggle.component.scss'],
})
export class SlideToggleComponent {
@ViewChild('TABLE') table: ElementRef;
@ViewChild(MatPaginator) paginator: MatPaginator;
  public displayedColumns = ['No', 'Image', 'Name', 'Treatment', 'Admit Date', 'Relative Number', 'Action'];
  public dataSource: any;
  public settings: Settings;
  public currentPage: any;
  public totalSize: any;
  public pageSize: any; 

  constructor(public appSettings:AppSettings, private http: HttpClient, private router: Router, public dialog: MatDialog, public _com: CommonService) {
    this.settings = this.appSettings.settings; 
    //this.dataSource = new MatTableDataSource<Element>(this.tablesService.getData());
    //this.getAppointmentFromTodayToFuture();
    this.patientStatus();
    this.changeStatus(this.pStatus);
    this.currentPage = 0;
    this.pageSize = 10     
  }
  outPut: any;
  pStatus: string= 'ADMIT';
  public changeStatus(status){
    this.http.post(this._com.baseUrl+'/getAllPatientAdmission', {adminId: localStorage.getItem('adminId'), patientStatus: status}).subscribe(
      result => {
        this.outPut = result;
        console.log("this.outPut===msg====>", this.outPut.data);
        if(this.outPut.resCode == 200){
          this.dataSource = new MatTableDataSource<Element[]>(this.outPut.data);
          this.dataSource.paginator = this.paginator;
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

  patientAllStatus: any;
  patientStatus(){
    this.http.get(this._com.baseUrl+'/getPatientStatus').subscribe( result => {
      this.patientAllStatus = result;
        //this.stateData = this.patientAllStatus.data;
    })
  }

  deleteIpdPatient(idValue): void {
    const dialogRef = this.dialog.open(DeleteIpdPatientComponent, {
      width: '400px',
       data: { id: idValue}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.changeStatus(this.pStatus);
    });
  }


  ExportTOExcel()
  {
    const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    
    /* save to file */
    XLSX.writeFile(wb, 'Admit-Patient-list.xlsx');
    
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


  //color = 'accent';
  //checked = false;
  //disabled = false;

}



//--------------------------------------------------------delete-ipd-patient ---------------------------------------//

@Component({
  selector: 'app-delete-ipd-patinet',
  templateUrl: './delete-ipd-patient.component.html',  
})

export class DeleteIpdPatientComponent {
  
  constructor( public dialogRef: MatDialogRef<DeleteIpdPatientComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public http: Http, public router: Router, public _com: CommonService){}

  deleteData: any;
  onNoClickDelete(idValue): void{
    this.http.post(this._com.baseUrl+'/deleteAppointment', {adminId: localStorage.getItem('adminId'), PatientBedId: idValue}).subscribe(
      result => {
        this.deleteData = result;
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