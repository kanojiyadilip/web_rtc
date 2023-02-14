import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { orders, products, customers, refunds } from '../dashboard.data';
import { Router } from '@angular/router';
import { Http, Headers, Response} from '@angular/http';
import { CommonService } from '../../../common.service';
import { HttpClient } from '@angular/common/http';

interface obj {
  resCode: number;
  resMsg: string;
  data: any;
  tokan: any;
}

@Component({
  selector: 'app-info-cards',
  templateUrl: './info-cards.component.html',
  styleUrls: ['./info-cards.component.scss']
})
export class InfoCardsComponent implements OnInit { 
  public orders: any[];
  public products: any[];
  public customers: any[];
  public refunds: any[];
  public colorScheme = {
    domain: ['#999']
  }; 
  public autoScale = true;
  @ViewChild('resizedDiv') resizedDiv:ElementRef;
  public previousWidthOfResizedDiv:number = 0; 
  public settings: Settings;
  constructor(public appSettings:AppSettings, private http: HttpClient, public router:Router, public _com: CommonService){
    this.settings = this.appSettings.settings; 
    this.getDashboardCount();
  }

  ngOnInit(){
    this.orders = orders;
    this.products = products;
    this.customers = customers;
    this.refunds = refunds;
    this.orders = this.addRandomValue('orders');     
    this.customers = this.addRandomValue('customers');
  }
  
  public onSelect(event) {
    console.log(event);
  }

  public addRandomValue(param) {
    switch(param) {
      case 'orders':
        for (let i = 1; i < 30; i++) { 
          this.orders[0].series.push({"name": 1980+i, "value": Math.ceil(Math.random() * 1000000)});
        } 
        return this.orders;
      case 'customers':
        for (let i = 1; i < 15; i++) { 
          this.customers[0].series.push({"name": 2000+i, "value": Math.ceil(Math.random() * 1000000)});
        } 
        return this.customers;
      default:
        return this.orders;
    }
  }

  ngOnDestroy(){
    this.orders[0].series.length = 0;
    this.customers[0].series.length = 0;
  }

  ngAfterViewChecked() {    
    if(this.previousWidthOfResizedDiv != this.resizedDiv.nativeElement.clientWidth){
      setTimeout(() => this.orders = [...orders] ); 
      setTimeout(() => this.products = [...products] ); 
      setTimeout(() => this.customers = [...customers] ); 
      setTimeout(() => this.refunds = [...refunds] );
    }
    this.previousWidthOfResizedDiv = this.resizedDiv.nativeElement.clientWidth;
  }


  outPut: any;
  counts: any = {};
  getDashboardCount(){

    this.http.post(this._com.baseUrl+'/dashboardCounts', {adminId: localStorage.getItem('adminId')}).subscribe(
      result => {
        this.outPut = result;
        console.log("this.outPut===data====>", this.outPut.data);
        if(this.outPut.resCode == 200){
          this.counts = this.outPut.data;
        }
        else{
          console.log("400===e====");
        }
      }      
    )

  }

}