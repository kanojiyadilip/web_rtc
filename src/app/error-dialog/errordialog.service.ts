import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ErrorDialogComponent } from './errordialog.component';

export interface resError {
    responseMsg: string;
    reason: string;
}

@Injectable()
export class ErrorDialogService {
    authError: resError;
    constructor(public dialog: MatDialog) { }
    openDialog(data): void {
        this.authError = data;
        const dialogRef = this.dialog.open(ErrorDialogComponent, {
            disableClose: true, 
            width: '300px',
            data: data
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            let animal;
            animal = result;
        });
    }
}