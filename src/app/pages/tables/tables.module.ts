import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../../shared/shared.module';
import { BasicComponent } from './basic/basic.component';
import { PagingComponent } from './paging/paging.component';
import { SortingComponent } from './sorting/sorting.component';
import { FilteringComponent, OpdPaymentComponent, DeleteAppointmentComponent } from './filtering/filtering.component';
import { SelectingComponent } from './selecting/selecting.component';
import { NgxTableComponent } from './ngx-table/ngx-table.component';
import { TablesService } from './tables.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UpdateAppointmentComponent } from './update-appointment/update-appointment.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { AppointmentHistoryComponent } from './appointment-history/appointment-history.component';

 
export const routes = [
  { path: '', redirectTo: 'basic', pathMatch: 'full'},
  { path: 'basic', component: BasicComponent, data: { breadcrumb: 'Book Appointment' } },
  { path: 'appointment/:id', component: UpdateAppointmentComponent, data: { breadcrumb: 'Appointment Detail' } },
  { path: 'paging', component: PagingComponent, data: { breadcrumb: 'Paging table' } },
  { path: 'sorting', component: SortingComponent, data: { breadcrumb: 'Sorting table' } },
  { path: 'filtering', component: FilteringComponent, data: { breadcrumb: 'All Appointment' } },  
  { path: 'selecting', component: SelectingComponent, data: { breadcrumb: 'Selecting table' } },
  { path: 'ngx-table', component: NgxTableComponent, data: { breadcrumb: 'Ngx datatable' } },
  { path: 'appointment-history', component: AppointmentHistoryComponent, data: { breadcrumb: 'Appointment History' } },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgxDatatableModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,    
  ],
  declarations: [
    BasicComponent, 
    PagingComponent, 
    SortingComponent, 
    FilteringComponent,
    SelectingComponent, 
    UpdateAppointmentComponent,
    NgxTableComponent,
    OpdPaymentComponent,
    DeleteAppointmentComponent,
    AppointmentHistoryComponent
  ],
  entryComponents: [
    OpdPaymentComponent,
    DeleteAppointmentComponent
  ],    
  providers: [
    TablesService
  ]
})
export class TablesModule { }
