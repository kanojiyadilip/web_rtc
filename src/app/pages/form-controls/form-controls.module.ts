import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedModule } from '../../shared/shared.module';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { FormFieldComponent } from './form-field/form-field.component';
import { InputComponent } from './input/input.component';
import { RadioButtonComponent } from './radio-button/radio-button.component';
import { SelectComponent } from './select/select.component';
import { SliderComponent } from './slider/slider.component';
import { SlideToggleComponent, DeleteIpdPatientComponent } from './slide-toggle/slide-toggle.component';
import { UpdateAdmitPatientComponent, IpdPatientAddBed, IpdPatientUpdateBed, IpdPatientAddOperation, IpdPatientUpdateOperation, IpdPatientAddDiagnosis, IpdPatientUpdateDiagnosis, IpdPatientAddDoctorVisit, IpdPatientUpdateDoctorVisit } from './update-admit-patient/update-admit-patient.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

export const routes = [
  { path: '', redirectTo: 'radio-button', pathMatch: 'full'},
  { path: 'autocomplete', component: AutocompleteComponent, data: { breadcrumb: 'Autocomplete' } },
  { path: 'checkbox', component: CheckboxComponent, data: { breadcrumb: 'Checkbox' } },
  { path: 'datepicker', component: DatepickerComponent, data: { breadcrumb: 'Datepicker' } },
  { path: 'form-field', component: FormFieldComponent, data: { breadcrumb: 'Form Field' } },
  { path: 'input', component: InputComponent, data: { breadcrumb: 'Input' } },
  { path: 'radio-button', component: RadioButtonComponent, data: { breadcrumb: 'Patient Admission' } },
  { path: 'select', component: SelectComponent, data: { breadcrumb: 'Select' } },
  { path: 'slider', component: SliderComponent, data: { breadcrumb: 'Slider' } },
  { path: 'slide-toggle', component: SlideToggleComponent, data: { breadcrumb: 'Admit Patient' } },
  { path: 'admit-patient/:id', component: UpdateAdmitPatientComponent, data: { breadcrumb: 'Admit Patinet detail' }}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    SharedModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,    
  ],
  declarations: [
    AutocompleteComponent, 
    CheckboxComponent, 
    DatepickerComponent, 
    FormFieldComponent, 
    InputComponent, 
    RadioButtonComponent, 
    SelectComponent, 
    SliderComponent, 
    SlideToggleComponent,
    UpdateAdmitPatientComponent,
    IpdPatientAddBed,
    IpdPatientUpdateBed,
    IpdPatientAddOperation,
    IpdPatientUpdateOperation,
    IpdPatientAddDiagnosis,
    IpdPatientUpdateDiagnosis,
    IpdPatientAddDoctorVisit,
    IpdPatientUpdateDoctorVisit,
    DeleteIpdPatientComponent
  ],
  entryComponents: [
    IpdPatientAddBed,
    IpdPatientUpdateBed,
    IpdPatientAddOperation,
    IpdPatientUpdateOperation,
    IpdPatientAddDiagnosis,
    IpdPatientUpdateDiagnosis,
    IpdPatientAddDoctorVisit,
    IpdPatientUpdateDoctorVisit,
    DeleteIpdPatientComponent
  ]
})
export class FormControlsModule { }