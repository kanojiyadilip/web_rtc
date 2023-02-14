import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { Http, Headers, Response} from '@angular/http';
import { Router } from '@angular/router';
import { CommonService } from '../../../common.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html'
})
export class DialogComponent {
  public animal: string;
  //public name: string;
  public settings: Settings;
  constructor(public appSettings:AppSettings, public dialog: MatDialog, public http: Http, public router: Router, public _com: CommonService) {
    this.settings = this.appSettings.settings; 
  }

   public opdPID: string;
   public name: string;
  openDialog(opdPID, name): void {
    
    let dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      data: { name: name, animal: this.animal, id: opdPID }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', opdPID);   
    });
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
})
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, public http: Http, public router: Router, public _com: CommonService) { }

  onNoClick(opdPID){
    //this.dialogRef.close();
    this.deleteOPDpatinet(opdPID);
  }
  outPut: any={};
  deleteOPDpatinet(opdPID){
    console.log("opdPID------2----->",opdPID);
    this.http.post(this._com.baseUrl+'/deleteOpdPatient', {adminId: localStorage.getItem('adminId'), opdPatientId: opdPID}).subscribe(
      result => {
        this.outPut = result.json();
        if(this.outPut.resCode == 200){
          this.router.navigate(['/master/all-patient']);
          this.dialogRef.close();
        }
        else{
          console.log("400===e====", this.outPut);
        }
      }      
    )    
   }   

}



// import { Component, Inject } from '@angular/core';
// import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
// import { AppSettings } from '../../../app.settings';
// import { Settings } from '../../../app.settings.model';

// @Component({
//   selector: 'app-dialog',
//   templateUrl: './dialog.component.html'
// })
// export class DialogComponent {
//   public animal: string;
//   public name: string;
//   public settings: Settings;
//   constructor(public appSettings:AppSettings, public dialog: MatDialog, public _com: CommonService) {
//     this.settings = this.appSettings.settings; 
//   }

//   openDialog(): void {
//     let dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
//       data: { name: this.name, animal: this.animal }
//     });

//     dialogRef.afterClosed().subscribe(result => {
//       console.log('The dialog was closed');
//       this.animal = result;
//     });
//   }

// }

// @Component({
//   selector: 'dialog-overview-example-dialog',
//   templateUrl: 'dialog-overview-example-dialog.html',
// })
// export class DialogOverviewExampleDialog {

//   constructor(
//     public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
//     @Inject(MAT_DIALOG_DATA) public data: any) { }

//   onNoClick(): void {
//     this.dialogRef.close();
//   }

// }
