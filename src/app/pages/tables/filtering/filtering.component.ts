import { Component, ViewChild, Inject, ElementRef } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { TablesService, Element } from '../tables.service';
import { Http, Headers, Response} from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../common.service';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';

interface obj {
  resCode: number;
  resMsg: string;
  data: any;
  tokan: any;
}

@Component({
  selector: 'app-filtering',
  templateUrl: './filtering.component.html',
  styleUrls: ['./filtering.component.scss'],
})
export class FilteringComponent {
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
  outPut: any;
  getAppointmentFromTodayToFuture(){
    this.http.post(this._com.baseUrl+'/getAllApponitment', {adminId: localStorage.getItem('adminId')}).subscribe(
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


  public handlePage(e: any) {
  console.log("===e====", e);
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    console.log("e.length------->",this.dataSource)
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


//--------------------------------------------------OPD PAY STATUS---------------------------------------//


@Component({
  providers: [FilteringComponent],
  selector: 'opd-payment',
  templateUrl: './opd-payment.component.html',
  //styleUrls: ['./opd-payment.component.scss'],
})

export class OpdPaymentComponent {
  public form:FormGroup;
  constructor(public ampCom: FilteringComponent, public dialogRef: MatDialogRef<OpdPaymentComponent>, @Inject(MAT_DIALOG_DATA) public data1: any, public fb: FormBuilder, public http: HttpClient, public router: Router, public _com: CommonService) { 

    this.form = this.fb.group({
      'appointmentStatus': [null, Validators.compose([Validators.required])],
      'doctorCharges': '',  //[null, Validators.compose([Validators.required])], 
      'otherCharges': '',  
      'paymentMode': '' //[null, Validators.compose([Validators.required])]
      });

      this.getOneAppointment(this.data1.appointmentId);
      //console.log("this.ampCom.paramValue=====>", this.ampCom.paramValue);     
  }

  paramValue: any;
  getPData: any;
  opdPatientId: any;
  docChargase: any;
  data: any = {};
  getOneAppointment(appointmentId){

      this.http.post(this._com.baseUrl+"/getOneAppointment", {appointmentId: appointmentId}).subscribe( result => {
        this.getPData = result;
        console.log("getPData=====>", this.getPData)
        if(this.getPData.resCode == 200){
          this.data = this.getPData.data
          this.opdPatientId = this.data.opdPatientId;
          this.docChargase = this.data.doctorCharges;
        }
        else if(this.getPData.resCode == 403){
          console.log("tokan is not provided");
        }
        else{
          console.log("+++++this.getPData+++++>",  this.getPData);
          this.router.navigate(['/master/filtering']);
        }
      })    
  } 

  public outPut: any;
  payM: string = "CASH";
  public onSubmit(value):void {
    if (this.form.valid) {
      this.http.post(this._com.baseUrl+'/updateAppointment', {adminId: localStorage.getItem('adminId'), appointmentId: this.data1.appointmentId,  doctorCharges: value.doctorCharges, otherCharges: value.otherCharges, appointmentStatus: value.appointmentStatus, paymentMode: value.paymentMode, payStatus: 'true' }).subscribe(
        result => {
          this.outPut = result;
          console.log("this.outPut=======>", this.outPut);
          if(this.outPut.resCode == 200){
            console.log("200=======");
            this.router.navigate(['/tables/filtering']);
            this.dialogRef.close();
            //this.ampCom.getAppointmentFromTodayToFuture();
            console.log("++++++ PAID +++++++")
          }
          else{
            //this.errMsg = "true";
            console.log("400=======");
          }
        }
      )
    }
  }

}

//--------------------------------------------------------delete-appointment.html---------------------------------------//

@Component({
  selector: 'app-delete-appointment',
  templateUrl: './delete-appointment.html',  
})

export class DeleteAppointmentComponent {
  
  constructor( public dialogRef: MatDialogRef<DeleteAppointmentComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public http: HttpClient, public router: Router, public _com: CommonService){}

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