import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
import { StaffUpdateComponent } from './update-staff/update-staff.component';
import { StaffAddComponent } from './add-staff/add-staff.component';
import { StaffListComponent, DeleteStaffComponent } from './staff-list/staff-list.component';

export const routes = [
  { path: '', redirectTo: 'add-staff', pathMatch: 'full' },
  { path: 'add-staff', component: StaffAddComponent, data: { breadcrumb: 'add staff' } },  
  { path: 'staff-list', component: StaffListComponent, data: { breadcrumb: 'staff list' } },
  { path: 'update-staff/:id', component: StaffUpdateComponent, data: { breadcrumb: 'staff list' } },    
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
    StaffListComponent,
    StaffAddComponent,
    StaffUpdateComponent,
    DeleteStaffComponent
  ],
  entryComponents: [
    DeleteStaffComponent
  ],  
    exports:[
        RouterModule
    ]  
})
export class StaffModule { }