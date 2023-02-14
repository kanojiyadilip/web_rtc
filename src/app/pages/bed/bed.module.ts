import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
import { BedUpdateComponent } from './update-bed/update-bed.component';
import { BedAddComponent } from './add-bed/add-bed.component';
import { BedListComponent, DeleteBedComponent } from './bed-list/bed-list.component';

import { BedCategoryUpdateComponent } from './update-bed-category/update-bed-category.component';
import { BedCategoryAddComponent } from './add-bed-category/add-bed-category.component';
import { BedCategoryListComponent, DeleteBedCategoryComponent } from './bed-category-list/bed-category-list.component';

export const routes = [
  { path: '', redirectTo: 'add-bed', pathMatch: 'full' },
  { path: 'add-bed', component: BedAddComponent, data: { breadcrumb: 'add bed' } },  
  { path: 'bed-list', component: BedListComponent, data: { breadcrumb: 'bed list' } },
  { path: 'update-bed/:id', component: BedUpdateComponent, data: { breadcrumb: 'bed list' } },
  { path: 'add-bed-category', component: BedCategoryAddComponent, data: { breadcrumb: 'add bed category' } },  
  { path: 'bed-category-list', component: BedCategoryListComponent, data: { breadcrumb: 'bed list category' } },
  { path: 'update-bed-category/:id', component: BedCategoryUpdateComponent, data: { breadcrumb: 'bed category list' } },      
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
    BedListComponent,
    BedAddComponent,
    BedUpdateComponent,
    BedCategoryListComponent,
    BedCategoryAddComponent,
    BedCategoryUpdateComponent,
    DeleteBedComponent,
    DeleteBedCategoryComponent
  ],
  entryComponents: [
    DeleteBedComponent,
    DeleteBedCategoryComponent
  ],  
    exports:[
        RouterModule
    ]  
})
export class BedModule { }