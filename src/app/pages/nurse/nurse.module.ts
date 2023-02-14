import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
import { NurseUpdateComponent } from './update-nurse/update-nurse.component';
import { NurseAddComponent } from './add-nurse/add-nurse.component';
import { NurseListComponent, DeleteNurseComponent } from './nurse-list/nurse-list.component';

export const routes = [
  { path: '', redirectTo: 'add-nurse', pathMatch: 'full' },
  { path: 'add-nurse', component: NurseAddComponent, data: { breadcrumb: 'add nurse' } },  
  { path: 'nurse-list', component: NurseListComponent, data: { breadcrumb: 'nurse list' } },
  { path: 'update-nurse/:id', component: NurseUpdateComponent, data: { breadcrumb: 'nurse list' } },    
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
    NurseListComponent,
    NurseAddComponent,
    NurseUpdateComponent,
    DeleteNurseComponent
  ],
  entryComponents: [
    DeleteNurseComponent
  ],
    exports:[
        RouterModule
    ]  
})
export class NurseModule { }