import { Routes, RouterModule, PreloadAllModules  } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { PagesComponent } from './pages/pages.component';
import { BlankComponent } from './pages/blank/blank.component';
import { SearchComponent } from './pages/search/search.component';
import { NotFoundComponent } from './pages/errors/not-found/not-found.component';
import { ErrorComponent } from './pages/errors/error/error.component';
import { AuthguardService }  from './service/authguard.service';

export const routes: Routes = [
    { 
        path: '', 
        component: PagesComponent, children: [
            { path: '', loadChildren: './pages/chat/chat.module#ChatModule', data: { breadcrumb: 'Dashboard' }, canActivate: [AuthguardService] },
            // { path: '', loadChildren: './pages/dashboard/dashboard.module#DashboardModule', data: { breadcrumb: 'Dashboard' }, canActivate: [AuthguardService] },
            { path: 'update-admin', loadChildren: './pages/update-admin/update-admin.module#UpdateAdminModule', data: { breadcrumb: 'Admin' }, canActivate: [AuthguardService] },            
            // { path: 'users', loadChildren: './pages/users/users.module#UsersModule', data: { breadcrumb: 'Users' }, canActivate: [AuthguardService] },
            // { path: 'master', loadChildren: './pages/ui/ui.module#UiModule', data: { breadcrumb: 'Doctor' }, canActivate: [AuthguardService] },
            { path: 'form-controls', loadChildren: './pages/form-controls/form-controls.module#FormControlsModule', data: { breadcrumb: 'IPD Patient' }, canActivate: [AuthguardService] },
            { path: 'tables', loadChildren: './pages/tables/tables.module#TablesModule', data: { breadcrumb: 'Appointment' }, canActivate: [AuthguardService] },
            { path: 'icons', loadChildren: './pages/icons/icons.module#IconsModule', data: { breadcrumb: 'Material Icons' } },
            // { path: 'department', loadChildren: './pages/department/department.module#DepartmentModule', data: { breadcrumb: 'Department', canActivate: [AuthguardService] } },                                  
            // { path: 'nurse', loadChildren: './pages/nurse/nurse.module#NurseModule', data: { breadcrumb: 'Nurse', canActivate: [AuthguardService] } },
            // { path: 'staff', loadChildren: './pages/staff/staff.module#StaffModule', data: { breadcrumb: 'Staff', canActivate: [AuthguardService] } },
            // { path: 'bed', loadChildren: './pages/bed/bed.module#BedModule', data: { breadcrumb: 'Bed', canActivate: [AuthguardService] } },                                                                        
            // { path: 'drag-drop', loadChildren: './pages/drag-drop/drag-drop.module#DragDropModule', data: { breadcrumb: 'Drag & Drop' }, canActivate: [AuthguardService] },
            // { path: 'schedule', loadChildren: './pages/schedule/schedule.module#ScheduleModule', data: { breadcrumb: 'Schedule' }, canActivate: [AuthguardService] },
            { path: 'mailbox', loadChildren: './pages/mailbox/mailbox.module#MailboxModule', data: { breadcrumb: 'Mailbox' }, canActivate: [AuthguardService] },
            { path: 'chat', loadChildren: './pages/chat/chat.module#ChatModule', data: { breadcrumb: 'Chat' } },
            // { path: 'maps', loadChildren: './pages/maps/maps.module#MapsModule', data: { breadcrumb: 'Maps' }, canActivate: [AuthguardService] },
            // { path: 'charts', loadChildren: './pages/charts/charts.module#ChartsModule', data: { breadcrumb: 'Charts' }, canActivate: [AuthguardService] },
            { path: 'dynamic-menu', loadChildren: './pages/dynamic-menu/dynamic-menu.module#DynamicMenuModule', data: { breadcrumb: 'Dynamic Menu' }, canActivate: [AuthguardService]  },          
            { path: 'blank', component: BlankComponent, data: { breadcrumb: 'Blank page' }, canActivate: [AuthguardService] },
            { path: 'search', component: SearchComponent, data: { breadcrumb: 'Search' }, canActivate: [AuthguardService] },
            // { path: 'doctorPayment', loadChildren: './pages/doctorPayment/doctorPayment.module#DoctorPaymentModule', data: { breadcrumb: 'Doctor Payment Module', canActivate: [AuthguardService] } },  
            // { path: 'diagnosis', loadChildren: './pages/diagnosis/diagnosis.module#DiagnosisModule', data: { breadcrumb: 'Diagnosis', canActivate: [AuthguardService] } }, 
            // { path: 'operation', loadChildren: './pages/operation/operation.module#OperationModule', data: { breadcrumb: 'Operation', canActivate: [AuthguardService] } },  
            // { path: 'report', loadChildren: './pages/report/report.module#ReportModule', data: { breadcrumb: 'Report', canActivate: [AuthguardService] } },                                              
        ]
    },    
    { path: 'landing', loadChildren: './pages/landing/landing.module#LandingModule' },
    { path: 'login', loadChildren: './pages/login/login.module#LoginModule' },
    { path: 'forgot-password', loadChildren: './pages/forgot-password/forgot-password.module#ForgotPasswordModule' },
    { path: 'register', loadChildren: './pages/register/register.module#RegisterModule' },
    { path: 'admin/reset-password/:token', loadChildren: './pages/reset-password/reset-password.module#ResetPasswordModule' },
    { path: 'error', component: ErrorComponent, data: { breadcrumb: 'Error' } },
    { path: '**', component: NotFoundComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {
   // preloadingStrategy: PreloadAllModules,  // <- comment this line for activate lazy load
   // useHash: true
});
