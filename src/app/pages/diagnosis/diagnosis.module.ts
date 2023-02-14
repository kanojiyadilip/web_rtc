import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
import { DiagnosisUpdateComponent } from './update-diagnosis/update-diagnosis.component';
import { DiagnosisAddComponent } from './add-diagnosis/add-diagnosis.component';
import { DiagnosisListComponent, DeleteDiagnosisComponent } from './diagnosis-list/diagnosis-list.component';

export const routes = [
  { path: '', redirectTo: 'add-diagnosis', pathMatch: 'full' },
  { path: 'add-diagnosis', component: DiagnosisAddComponent, data: { breadcrumb: 'add diagnosis' } },  
  { path: 'diagnosis-list', component: DiagnosisListComponent, data: { breadcrumb: 'diagnosis list' } },
  { path: 'update-diagnosis/:id', component: DiagnosisUpdateComponent, data: { breadcrumb: 'diagnosis list' } },    
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
    DiagnosisListComponent,
    DiagnosisAddComponent,
    DiagnosisUpdateComponent,
    DeleteDiagnosisComponent
  ],
  entryComponents: [
    DeleteDiagnosisComponent
  ],
    exports:[
        RouterModule
    ]  
})
export class DiagnosisModule { }