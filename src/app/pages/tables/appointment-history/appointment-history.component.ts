import { Component, ViewChild, Inject, ElementRef, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { TablesService, Element } from '../tables.service';
import { Http, Headers, Response} from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../common.service';
import { OpdPaymentComponent } from '../filtering/filtering.component';
import { DeleteAppointmentComponent } from '../filtering/filtering.component';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';

interface obj {
  resCode: number;
  resMsg: string;
  data: any;
  tokan: any;
}

@Component({
  selector: 'app-appointment-history',
  templateUrl: './appointment-history.component.html',
  styleUrls: ['./appointment-history.component.scss']
})
export class AppointmentHistoryComponent implements OnInit {

	@ViewChild('TABLE') table: ElementRef;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	  public displayedColumns = ['No', 'Patient Name', 'Doctor Name', 'Mobile', 'Schedule', 'Token', 'Charges', 'Status', 'Action'];
	  public dataSource: any;
	  public settings: Settings;
  	  public currentPage: any;
  	  public totalSize: any;
  	  public pageSize: any;

	  constructor(public appSettings:AppSettings, private tablesService:TablesService, private http: HttpClient, private router: Router, public dialog: MatDialog, public _com: CommonService) {
	    this.settings = this.appSettings.settings; 
	    //this.dataSource = new MatTableDataSource<Element>(this.tablesService.getData());
	    this.getAppointmentFromTodayToFuture();
        this.currentPage = 0;
        this.pageSize = 10 	    
	  }

	  ngOnInit(){}

	  outPut: any;
	  getAppointmentFromTodayToFuture(){
	    this.http.post(this._com.baseUrl+'/getAllApponitment', {adminId: localStorage.getItem('adminId'), tens: 'past'}).subscribe(
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

	  openDialogOpdPayment(appointmentId){
	    console.log("appointmentId======>", appointmentId);
	    const dialogRef = this.dialog.open(OpdPaymentComponent, {
	      width: '650px',
	       data: { appointmentId: appointmentId}
	    });

	    dialogRef.afterClosed().subscribe(result => {
	      this.getAppointmentFromTodayToFuture();
	      console.log('The dialog was closed');
	    });    
	  
	  }

	  deleteAppointment(idValue): void {
	    const dialogRef = this.dialog.open(DeleteAppointmentComponent, {
	      width: '400px',
	       data: { id: idValue}
	    });

	    dialogRef.afterClosed().subscribe(result => {
	      console.log('The dialog was closed');
	      this.getAppointmentFromTodayToFuture();
	    });
	  }


	ExportTOExcel()
	{
	  const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.table.nativeElement);
	  const wb: XLSX.WorkBook = XLSX.utils.book_new();
	  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
	  
	  /* save to file */
	  XLSX.writeFile(wb, 'Appoient-Today-To-Fututr-list.xlsx');
	  
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
