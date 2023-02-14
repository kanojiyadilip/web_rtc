import { Component, ViewChild, OnInit, Inject, ElementRef } from '@angular/core';
import { Http, Headers, Response} from '@angular/http';
import { Router } from '@angular/router';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatTableDataSource, MatPaginator } from '@angular/material';
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
  templateUrl: './opd-all-payment.component.html',
  styleUrls: ['./opd-all-payment.component.scss'],
  providers: [DialogComponent]
})
export class OpdAllPaymentComponent {
  @ViewChild('TABLE') table: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public displayedColumns = ['No', 'Image', 'DoctorName', 'Department', 'TodayCharges', 'OtherCharges', 'TotalCharges', 'TotalAppoientment'];
  public dataSource: any;
  public settings: Settings;
  public currentPage: any;
  public totalSize: any;
  public pageSize: any; 
  outPut: any;
  data: arry1[];  
  toDay: any;
  
  constructor(public dialogComponent : DialogComponent, public appSettings:AppSettings, private http: HttpClient, public router:Router, public _com: CommonService) {
    this.settings = this.appSettings.settings; 
    // this.dataSource = new MatTableDataSource<Element>(this.tablesService.getData());
    this.toDay = new Date();
    this.getAllOpdPayment(this.toDay);
    this.currentPage = 0;
    this.pageSize = 10     
  }
  
  public getAllOpdPayment(toDayDate){
    this.http.post(this._com.baseUrl+'/getAllDoctorTodayPayment', {adminId: localStorage.getItem('adminId'), date: toDayDate}).subscribe(
      result => {
        this.outPut = result;
        console.log("this.outPut.data===msg====>", this.outPut.data);
        if(this.outPut.resCode == 200){
          this.dataSource = new MatTableDataSource<Element[]>(this.outPut.data);
          this.dataSource.paginator = this.paginator;
          // this.dataSource.filter = filterValue.trim().toLowerCase();
          // this.dataSource = new MatTableDataSource<Element>(this.data);
          //console.log("200===1====", this.dataSource.paginator);
          console.log("200===2====", this.paginator);
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

  dateEvent(event){
   console.log("event======>", event);
   this.getAllOpdPayment(event);
  }

  ExportTOExcel()
  {
    const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    
    /* save to file */
    XLSX.writeFile(wb, 'Docotr-Payment-list.xlsx');
    
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