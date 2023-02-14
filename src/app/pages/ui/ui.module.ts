import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ButtonsComponent } from './buttons/buttons.component';
import { AddPatientComponent } from './add-patient/add-patient.component';
import { AddIpdPatientComponent } from './/add-ipd-patient/add-ipd-patient.component';
import { AddDoctorComponent } from './add-doctor/add-doctor.component';
import { AddDoctorScheduleComponent } from './add-doctor-schedule/add-doctor-schedule.component';
import { DoctorComponent } from './doctor/doctor.component';
import { DoctorScheduleComponent } from './doctorSchedule/doctor-schedule.component'
import { PatientComponent } from './patient/patient.component';
import { UpdateIpdPatientComponent } from './update-ipd-patient/update-ipd-patient.component';
import { CardsComponent, DeleteDoctorComponent } from './cards/cards.component';
import { ListsComponent, DeleteDoctorScheduleComponent } from './lists/lists.component';
import { GridsComponent } from './grids/grids.component';
import { TabsComponent } from './tabs/tabs.component';
import { ExpansionPanelComponent } from './expansion-panel/expansion-panel.component';
import { ChipsComponent } from './chips/chips.component';
import { ProgressComponent } from './progress/progress.component';
import { TooltipComponent } from './tooltip/tooltip.component';
import { DialogComponent, DialogOverviewExampleDialog } from './dialog/dialog.component';
import { SnackBarComponent } from './snack-bar/snack-bar.component';
import { TablesService } from '../tables/tables.service';

export const routes = [
  { path: '', redirectTo: 'all-doctor', pathMatch: 'full'},
  { path: 'all-patient', component: ButtonsComponent, data: { breadcrumb: 'All OPD Patinet' } },
  { path: 'patient/:id', component: PatientComponent, data: { breadcrumb: 'Patient Detail' } },
  { path: 'add-patient', component: AddPatientComponent, data: { breadcrumb: 'Add New OPD Patinet' } },
  { path: 'add-ipd-patient', component: AddIpdPatientComponent, data: { breadcrumb: 'Add New IPD Patient' } },
  { path: 'doctor/:id', component: DoctorComponent, data: { breadcrumb: 'Doctor Detail' } },
  { path: 'ipd-patient/:id', component: UpdateIpdPatientComponent, data: { breadcrumb: 'IPD Patient Detail' } },
  { path: 'all-doctor', component: CardsComponent, data: { breadcrumb: 'All Doctor' } },
  { path: 'add-doctor', component: AddDoctorComponent, data: { breadcrumb: 'Add New Doctor' } },
  { path: 'all-doctor-schedule', component: ListsComponent, data: { breadcrumb: 'All doctor Schedule' } },
  { path: 'doctor-schedule/:id', component: DoctorScheduleComponent, data: { breadcrumb: 'Doctor Schedule Detail' } },
  { path: 'add-doctor-schedule', component: AddDoctorScheduleComponent, data: { breadcrumb: 'Add Doctor Schedule' } },
  { path: 'grids', component: GridsComponent, data: { breadcrumb: 'Grids' } },
  { path: 'tabs', component: TabsComponent, data: { breadcrumb: 'Tabs' } },
  { path: 'expansion-panel', component: ExpansionPanelComponent, data: { breadcrumb: 'Expansion Panel' } },
  { path: 'chips', component: ChipsComponent, data: { breadcrumb: 'Chips' } },
  { path: 'progress', component: ProgressComponent, data: { breadcrumb: 'Progress' } },
  { path: 'dialog', component: DialogComponent, data: { breadcrumb: 'Dialog' } },
  { path: 'tooltip', component: TooltipComponent, data: { breadcrumb: 'Tooltip' } },
  { path: 'snack-bar', component: SnackBarComponent, data: { breadcrumb: 'Snackbar' } }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    ButtonsComponent, 
    AddPatientComponent,
    AddIpdPatientComponent,
    PatientComponent,
    CardsComponent,
    AddDoctorComponent,
    UpdateIpdPatientComponent,
    DoctorComponent,
    ListsComponent,
    AddDoctorScheduleComponent, 
    DoctorScheduleComponent,
    GridsComponent, 
    TabsComponent, 
    ExpansionPanelComponent, 
    ChipsComponent, 
    ProgressComponent, 
    TooltipComponent, 
    DialogComponent, 
    DialogOverviewExampleDialog,
    SnackBarComponent,
    DeleteDoctorComponent,
    DeleteDoctorScheduleComponent
  ],
  entryComponents: [
    DialogOverviewExampleDialog,
    DeleteDoctorComponent,
    DeleteDoctorScheduleComponent
  ],
  providers: [
    TablesService
  ]
})
export class UiModule { }
