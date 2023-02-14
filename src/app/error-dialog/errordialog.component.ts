import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './errordialog.component.html'
})
export class ErrorDialogComponent {
  title = 'Angular-Interceptor';
  constructor(@Inject(MAT_DIALOG_DATA) public data: string, public dialogRef: MatDialogRef<ErrorDialogComponent>, public router:Router) {}

  logOut(){
    localStorage.removeItem('adminId');
    localStorage.removeItem('token'); 
    this.router.navigate(['/login']); 	
    this.dialogRef.close();
  }
}