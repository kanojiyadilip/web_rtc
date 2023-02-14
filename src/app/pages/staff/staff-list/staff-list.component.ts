import { Component, ViewChild, Inject, ElementRef } from '@angular/core';
import { Http, Headers, Response} from '@angular/http';
import { Router } from '@angular/router';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
//import { TablesService, Element } from '../../tables/tables.service';
import { DialogComponent } from '../../ui/dialog/dialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
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
  selector: 'app-staff-list',
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.scss'],
  providers: [DialogComponent]
})
export class StaffListComponent {
@ViewChild('TABLE') table: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public displayedColumns = ['No', 'Image', 'Name', 'Gender', 'DOB', 'Mobile', 'Joining Date', 'Action'];
  public dataSource: any;
  public settings: Settings;
  public currentPage: any;
  public totalSize: any;
  public pageSize: any;  
  outPut: any;
  data: arry1[];  
  constructor(public dialogComponent : DialogComponent, public appSettings:AppSettings, private http: HttpClient, public router:Router, public _com: CommonService, public dialog: MatDialog) {
    this.settings = this.appSettings.settings; 
    // this.dataSource = new MatTableDataSource<Element>(this.tablesService.getData());
    this.getAllStaff();
    this.currentPage = 0;
    this.pageSize = 10;
    console.log("e.length---2---->",this.dataSource)
  }
  
  public datal: any;
  public getAllStaff(){
    this.http.post(this._com.baseUrl+'/getAllStaff', {adminId: localStorage.getItem('adminId')}).subscribe(
      result => {
        this.outPut = result;
        console.log("this.outPut.data===msg====>", this.outPut.data);
        this.datal = this.outPut.data.length;
        console.log("this.datal====>", this.datal);
        if(this.outPut.resCode == 200){
          this.dataSource = new MatTableDataSource<Element[]>(this.outPut.data);
          this.dataSource.paginator = this.paginator;
          // this.dataSource.filter = filterValue.trim().toLowerCase();
          // this.dataSource = new MatTableDataSource<Element>(this.data);
          //console.log("200===1====", this.dataSource.paginator);
          //console.log("200===2====", this.paginator);
        }
        else{
          //console.log("400===e====");
        }
      }      
    )
  }

  public handlePage(e: any) {
  console.log("===e====", e);
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    //console.log("e.length------->",this.dataSource)
  }

  deleteStaff(idValue): void {
    const dialogRef = this.dialog.open(DeleteStaffComponent, {
      width: '400px',
       data: { id: idValue}
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
      this.getAllStaff();
    });
  }


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

ExportTOExcel()
{

  this.pageSize = this.datal;
  //console.log("this.pageSize-------->", this.pageSize);
  setTimeout(() => { 
    const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Staff-List');
    
    /* save to file */
    XLSX.writeFile(wb, 'Staff-list.xlsx');
    this.pageSize = 10;
  }, 1500);  
  
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


//--------------------------------------------------------delete-Nurse ---------------------------------------//

@Component({
  selector: 'app-delete-staff',
  templateUrl: './delete-staff.component.html',  
})

export class DeleteStaffComponent {
  
  constructor( public dialogRef: MatDialogRef<DeleteStaffComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public http: HttpClient, public router: Router, public _com: CommonService){}

  deleteData: any;
  onNoClickDelete(idValue): void{
    this.http.post(this._com.baseUrl+'/deleteStaff', {adminId: localStorage.getItem('adminId'), staffId: idValue}).subscribe(
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