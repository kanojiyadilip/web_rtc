import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
import { OperationUpdateComponent } from './update-operation/update-operation.component';
import { OperationAddComponent } from './add-operation/add-operation.component';
import { OperationListComponent, DeleteOperationComponent } from './operation-list/operation-list.component';

export const routes = [
  { path: '', redirectTo: 'add-operation', pathMatch: 'full' },
  { path: 'add-operation', component: OperationAddComponent, data: { breadcrumb: 'add operation' } },  
  { path: 'operation-list', component: OperationListComponent, data: { breadcrumb: 'operation list' } },
  { path: 'update-operation/:id', component: OperationUpdateComponent, data: { breadcrumb: 'operation list' } },    
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
    OperationListComponent,
    OperationAddComponent,
    OperationUpdateComponent,
    DeleteOperationComponent
  ],
  entryComponents: [
    DeleteOperationComponent
  ],
    exports:[
        RouterModule
    ]  
})
export class OperationModule { }