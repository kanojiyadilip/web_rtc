import { Component, ViewChild } from '@angular/core';
import { Http, Headers, Response} from '@angular/http';
import { Router } from '@angular/router';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { TablesService, Element } from '../../tables/tables.service';
import { DialogComponent } from '../dialog/dialog.component';
import { CommonService } from '../../../common.service';
import { HttpClient } from '@angular/common/http';

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
  selector: 'app-grids',
  templateUrl: './grids.component.html',
  styleUrls: ['./grids.component.scss'],
  providers: [DialogComponent]
})
export class GridsComponent {


  @ViewChild(MatPaginator) paginator: MatPaginator;
  public displayedColumns = ['No', 'Image', 'Name', 'Gender', 'DOB', 'Mobile', 'City', 'State', 'PinCode', 'Action'];
  public dataSource: any;
  public settings: Settings;
  outPut: any;
  data: arry1[];  
  constructor(public dialogComponent : DialogComponent, public appSettings:AppSettings, private tablesService:TablesService, private http: HttpClient, public router:Router, public _com: CommonService) {
    this.settings = this.appSettings.settings; 
    // this.dataSource = new MatTableDataSource<Element>(this.tablesService.getData());
    this.getAllOpdPatient();
  }
  
  public getAllOpdPatient(){
    this.http.post(this._com.baseUrl+'/getAllPatientDetail', {adminId: localStorage.getItem('adminId')}).subscribe(
      result => {
        this.outPut = result;
        console.log("this.outPut===msg====>", this.outPut);
        if(this.outPut.resCode == 200){
          this.dataSource = new MatTableDataSource<Element[]>(this.outPut.data);
          this.dataSource.paginator = this.paginator;
          // this.dataSource.filter = filterValue.trim().toLowerCase();
          // this.dataSource = new MatTableDataSource<Element>(this.data);
          console.log("200===1====", this.dataSource.paginator);
          console.log("200===2====", this.paginator);
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
}












//  public tiles = [
//    {text: 'One', cols: 3, rows: 1, color: 'lightblue'},
//    {text: 'Two', cols: 1, rows: 2, color: 'lightgreen'},
//    {text: 'Three', cols: 1, rows: 1, color: 'lightpink'},
//    {text: 'Four', cols: 2, rows: 1, color: '#DDBDF1'}
//  ];
//  public settings: Settings;
 //  constructor(public appSettings:AppSettings) {
 //    this.settings = this.appSettings.settings; 
 //  }