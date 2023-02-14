import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
import { DepartmentUpdateComponent } from './department-update/department-update.component';
import { DepartmentAddComponent } from './add-department/departmentadd.component';
import { DepartmentComponent, DeleteDepartmentComponent } from './department-list/department.component';

export const routes = [
  { path: '', redirectTo: 'add-department', pathMatch: 'full' },
  { path: 'add-department', component: DepartmentAddComponent, data: { breadcrumb: 'add department' } },  
  { path: 'department-list', component: DepartmentComponent, data: { breadcrumb: 'department list' } },
  { path: 'update-department/:id', component: DepartmentUpdateComponent, data: { breadcrumb: 'department list' } },    
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
    DepartmentComponent,
    DepartmentAddComponent,
    DepartmentUpdateComponent,
    DeleteDepartmentComponent
  ],
  entryComponents: [
    DeleteDepartmentComponent
  ],  
    exports:[
        RouterModule
    ]  
})
export class DepartmentModule { }