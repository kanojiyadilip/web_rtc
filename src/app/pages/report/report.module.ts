import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
import { AppointmentReportComponent } from './appointment-report/appointment-report.component';
import { IpdPatientReportComponent } from './ipd-patient-report/ipd-patient-report.component';
import { OperationReportComponent } from './operation-report/operation-report.component';
import { DoctorVisitReportComponent } from './doctor-visit-report/doctor-visit-report.component';
import { DiagnosisReportComponent } from './diagnosis-report/diagnosis-report.component';


export const routes = [
  { path: '', redirectTo: 'appointment-report', pathMatch: 'full' },
  { path: 'appointment-report', component: AppointmentReportComponent, data: { breadcrumb: 'Appointment Report' }},
  { path: 'ipd-patient-report', component: IpdPatientReportComponent, data: { breadcrumb: 'Ipd Patient Report' }},
  { path: 'operation-report', component: OperationReportComponent, data: { breadcrumb: 'Operation Report' }},
  { path: 'doctor-visit-report', component: DoctorVisitReportComponent, data: { breadcrumb: 'Doctor Visit Report' }},
  { path: 'diagnosis-report', component: DiagnosisReportComponent, data: { breadcrumb: 'Diagnosis Report' }},    
];


@NgModule({
  declarations: [AppointmentReportComponent, IpdPatientReportComponent, OperationReportComponent, DoctorVisitReportComponent, DiagnosisReportComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,    
    SharedModule
  ],
    exports:[
        RouterModule
    ]  
})
export class ReportModule { }
