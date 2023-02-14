import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
import { OpdAllPaymentComponent } from './all-doctor-today-payment/opd-all-payment.component';
import { OneDoctorOpdDetailComponent } from './one-doctor-opd-detail/one-doctor-opd-detail.component'

export const routes = [
  { path: '', redirectTo: 'today-all-doctor-payment', pathMatch: 'full' },
  { path: 'today-all-doctor-payment', component: OpdAllPaymentComponent, data: { breadcrumb: 'Today All Opd Payment Of Doctor' } },   
  { path: 'get-doctor-opd-patient/:id/:date', component: OneDoctorOpdDetailComponent, data: { breadcrumb: 'bed list category' } },      
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,     
    FormsModule,   
    SharedModule
  ],
  declarations: [
    OpdAllPaymentComponent,
    OneDoctorOpdDetailComponent
  ],
    exports:[
        RouterModule
    ]  
})
export class DoctorPaymentModule { }