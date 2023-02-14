import { Component, ViewChild, OnInit, Inject, ElementRef } from '@angular/core';
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
  selector: 'app-bed-category-list',
  templateUrl: './bed-category-list.component.html',
  styleUrls: ['./bed-category-list.component.scss'],
  providers: [DialogComponent]
})
export class BedCategoryListComponent {
  @ViewChild('TABLE') table: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public displayedColumns = ['No', 'Bed Category', 'price', 'Action'];
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
    this.getAllgetAllBedCategory();
    this.currentPage = 0;
    this.pageSize = 10;    
  }
  
  public getAllgetAllBedCategory(){
    this.http.post(this._com.baseUrl+'/getAllBedCategory', {adminId: localStorage.getItem('adminId')}).subscribe(
      result => {
        this.outPut = result;
        console.log("this.outPut.data===msg====>", this.outPut.data);
        if(this.outPut.resCode == 200){
          this.dataSource = new MatTableDataSource<Element[]>(this.outPut.data);
          this.dataSource.paginator = this.paginator;
          console.log("200===2====", this.paginator);
        }
        else{
          console.log("400===e====");
          alert(this.outPut.resMsg);
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

  deleteBedCategory(idValue): void {
    const dialogRef = this.dialog.open(DeleteBedCategoryComponent, {
      width: '400px',
       data: { id: idValue}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getAllgetAllBedCategory();
    });
  }

ExportTOExcel()
{
  const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.table.nativeElement);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
  /* save to file */
  XLSX.writeFile(wb, 'Bed-Category-list.xlsx');
  
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


//-----------------------------------------------------delete_bed_category.component.html----------------------------------------------//


@Component({
  selector: 'app-delete-bed-category',
  templateUrl: './delete_bed_category.component.html',  
})

export class DeleteBedCategoryComponent {
  
  constructor( public dialogRef: MatDialogRef<DeleteBedCategoryComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public http: HttpClient, public router: Router, public _com: CommonService){}

  deleteData: any;
  onNoClickDelete(idValue): void{
    this.http.post(this._com.baseUrl+'/deleteBedCategory', {adminId: localStorage.getItem('adminId'), bedCategoryId: idValue}).subscribe(
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