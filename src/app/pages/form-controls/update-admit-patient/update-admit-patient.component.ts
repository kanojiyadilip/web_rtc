import { Component, ViewChild, ElementRef, Inject } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Http, Headers, Response} from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { CommonService } from '../../../common.service';

interface obj {
    resCode: number;
    resMsg: string;
    data: any;
    tokan: any;
  }

interface array{
  opdCharge1: number;
  opdCharge2: number;
  opdCharge3: number;
  ipdCharge: number;
  name: string;
}

interface obj1 {
    name: string;
    gender: string;
    dob: Date;
    mobileNo1: string;
    mobileNo2: string;
    address: string;
    state: string;
    city: string;
    pinCode: number;
    updateTime: Date;
  }  

 interface obj2 {
    chargase: any;
    service: any;
 } 

@Component({
  selector: 'update-admit-patient',
  templateUrl: './update-admit-patient.component.html',
  styleUrls: ['./update-admit-patient.component.scss'],
})
export class UpdateAdmitPatientComponent {
  @ViewChild('alert') alert: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public displayedColumns = ['No', 'bedCategoryName', 'bedNo', 'inDate', 'outDate', 'perDayPrice', 'Action'];
  public displayedColumns2 = ['No', 'Operation Name', 'Operation Charge', 'Operation Date', 'Doctor Name', 'Action'];
  public displayedColumns3 = ['No', 'Diagnosis Name', 'Diagnosis Charge', 'Doctor Name', 'Action'];
  public displayedColumns4 = ['No', 'Doctor Name', 'Visit Charge', 'Visit Date', 'Action'];
  public dataSource: any;
  public dataSource2: any;
  public dataSource3: any;
  public dataSource4: any;
  closeAlert() {
    this.alert.nativeElement.classList.remove('show');
    this.errMsg = "";
  }   
  itemArray: any;
  public form:FormGroup;
  public formUpdate: FormGroup;
  public outPut: any;
  public settings: Settings;
  public errMsg: string="";

  constructor( public appSettings:AppSettings, public fb: FormBuilder, public router:Router, private activatedRoute : ActivatedRoute, private http: HttpClient, public dialog: MatDialog, public _com: CommonService){
    this.settings = this.appSettings.settings; 
    this.form = this.fb.group({
      'name': [null, Validators.compose([Validators.required])],
      'dob': [null, Validators.compose([Validators.required])], 
      'treatment': [null, Validators.compose([Validators.required])], 
      'referenceBy': [null, Validators.compose([Validators.required])],
      'weight': '',
      'height': '', 
      'admitDate': [null, Validators.compose([Validators.required])], 
      'dischargeDate': [null, Validators.compose([Validators.required])],
      'remark': '',
      'patientStatus': [null, Validators.compose([Validators.required])],
    });


    this.formUpdate = this.fb.group({
      'name': [null, Validators.compose([Validators.required])],
      'gender': [null, Validators.compose([Validators.required])],
      'dob': [null, Validators.compose([Validators.required])], 
      'mobileNo1': [null,[Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]], 
      'mobileNo2': [null, [Validators.pattern(/^[6-9]\d{9}$/)]],
      'relativeName': [null, Validators.compose([Validators.required])],
      'relativeNumber': [null,[Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]], 
      'address': [null, Validators.compose([Validators.required])], 
      'state': [null, Validators.compose([Validators.required])],
      'city': [null, Validators.compose([Validators.required])], 
      'pinCode': [null, [Validators.required, Validators.pattern(/^[0-9]\d{5}$/)]],
      'bloodGroup': [null, Validators.compose([Validators.required])],
    });



    this.hositalDetail();
    this.getOneAdmitPatient();
    this.department();
    this.patientStatus();
    this.getOneAdmitPatientInvoice();
    this.PS = 'ADMIT';
    this.state();
    this.bloodGroupList = this._com.bloodGroup;
  }

  public min = new Date();
  public onSubmit(value):void {
    if (this.form.controls.name.valid && this.form.controls.dob.valid && this.form.controls.treatment.valid && this.form.controls.referenceBy.valid && this.form.controls.admitDate.valid && this.form.controls.patientStatus.valid) {
      // this.router.navigate(['/']);
      if(this.PS ==  'ADMIT'){
        this.http.post(this._com.baseUrl+'/updatePatientAdmission', {adminId: localStorage.getItem('adminId'), patientAdmissionId: this.paramValue, ipdPatinetName: value.ipdPatinetName, weight: value.weight, height: value.height, dob: value.dob, treatment: value.treatment, admitDate: value.admitDate, dischargeDate: value.dischargeDate, patientStatus: value.patientStatus, referenceBy: value.referenceBy, remark: value.remark }).subscribe(
          result => {
            this.outPut = result;
            console.log("this.outPut=======>", this.outPut);
            if(this.outPut.resCode == 200){
              console.log("200=======");
              this.router.navigate(['/form-controls/slide-toggle']);
            }
            else{
              this.errMsg = "true";
              console.log("400=======");
            }
          }
        )
      }
    }
  }


  public PS: string = 'ADMIN';
  selectStatus(pStatus){
    this.PS = pStatus;
    console.log("this.PS-------->", this.PS);
  }


  getPDataInv: any;
  dataInv: any = {};
  inWord: any;
  invData: obj2[] = new Array();
  getOneAdmitPatientInvoice(){
    this.activatedRoute.params.subscribe(values => {
      console.log("values=====>", values);
      this.http.post(this._com.baseUrl+'/getPatientInvoice', {patientAdmissionId: values.id}).subscribe( result => {
        this.getPDataInv = result;
        console.log("getPDataInv=====>", this.getPDataInv)
        if(this.getPDataInv.resCode == 200){
          this.dataInv = this.getPDataInv.data
          this.invData = this.dataInv.invData;
          this.inWord = this.dataInv.totalAmountInWord ;
          console.log("invData=====>", this.invData)
        }
        else if(this.getPDataInv.resCode == 403){
          console.log("tokan is not provided");
        }
        else{
          //this.router.navigate(['/form-controls/slide-toggle']);
        }
      })    
   });    
  }

  
  paramValue: any;
  getPData: any;
  opdPatientId: any;
  docChargase: any;
  data: any = {};
  getOneAdmitPatient(){
    this.activatedRoute.params.subscribe(values => {
      console.log("values=====>", values);
      this.paramValue = values.id;
      console.log("values=====>", this.paramValue);
      this.http.post(this._com.baseUrl+'/getOnePatientAdmission', {patientAdmissionId: this.paramValue}).subscribe( result => {
        this.getPData = result;
        console.log("getPData=====>", this.getPData)
        if(this.getPData.resCode == 200){
          this.data = this.getPData.data
          this.getOnePatientBsicDetail(this.data.patientId);
          console.log("this.data=>", this.data);
          this.dataSource = new MatTableDataSource<Element[]>(this.data.bedDetail);
          this.dataSource.paginator = this.paginator;

          this.dataSource2 = new MatTableDataSource<Element[]>(this.data.operationDetail);
          this.dataSource2.paginator = this.paginator;

          this.dataSource3 = new MatTableDataSource<Element[]>(this.data.diagnosisDetail);
          this.dataSource3.paginator = this.paginator;   

          console.log("this.data.doctorDetail========>", this.data.doctorDetail);
          this.dataSource4 = new MatTableDataSource<Element[]>(this.data.doctorDetail);
          this.dataSource4.paginator = this.paginator;                    

          this.opdPatientId = this.data.opdPatientId;
          this.docChargase = this.data.doctorCharges;
          console.log("this.docChargase=>", this.docChargase);
          console.log("this.data.doctorCharges==>",this.data.doctorCharges);
          console.log("this.data===>",this.data);
          this.select(this.data.department);
          this.doctorSelect(this.data.doctorId);
        }
        else if(this.getPData.resCode == 403){
          console.log("tokan is not provided");
        }
        else{
          console.log("+++++this.getPData+++++>",  this.getPData);
          //this.router.navigate(['/form-controls/slide-toggle']);
        }
      })    
   });    
  }

  getOneAdmitP(patientAdmissionId){
    console.log("patientAdmissionId=====>", patientAdmissionId);
    this.http.post(this._com.baseUrl+'/getOnePatientAdmission', {patientAdmissionId: patientAdmissionId}).subscribe( result => {
      this.getPData = result;
      console.log("getPData=====>", this.getPData)
      if(this.getPData.resCode == 200){
        this.data = this.getPData.data
        console.log("this.data=>", this.data);
        this.dataSource = new MatTableDataSource<Element[]>(this.data.bedDetail);
        this.dataSource.paginator = this.paginator;

        this.dataSource2 = new MatTableDataSource<Element[]>(this.data.operationDetail);
        this.dataSource2.paginator = this.paginator;

        this.dataSource3 = new MatTableDataSource<Element[]>(this.data.diagnosisDetail);
        this.dataSource3.paginator = this.paginator;   

        console.log("this.data.doctorDetail========>", this.data.doctorDetail);
        this.dataSource4 = new MatTableDataSource<Element[]>(this.data.doctorDetail);
        this.dataSource4.paginator = this.paginator;                    

        this.opdPatientId = this.data.opdPatientId;
        this.docChargase = this.data.doctorCharges;

        this.select(this.data.department);
        this.doctorSelect(this.data.doctorId);
      }
      else if(this.getPData.resCode == 403){
        //console.log("tokan is not provided");
        return false;
      }
      else{
        //this.router.navigate(['/form-controls/slide-toggle']);
        return false;
      }
    })    
  }  
    showElement: boolean;
    print(invoice){
      const printContent = document.getElementById("invoice");
      const WindowPrt = window.open('', '', 'left=0,top=0,width=1000,height=1000,toolbar=0,scrollbars=0,status=0');
      //const is_chrome = Boolean(WindowPrt.chrome);
      WindowPrt.document.write(printContent.innerHTML);
      WindowPrt.document.close();
      this.showElement = true;
      setTimeout(() => {
        WindowPrt.focus();
        WindowPrt.print();
        WindowPrt.close(); 
        this.showElement = false;
      }, 2000);         
    }    

  docDecp: any;
  department(){
    this.http.post(this._com.baseUrl+'/getAlldepartment', {adminId: localStorage.getItem('adminId')}).subscribe( result => {
      this.docDecp = result;
      console.log("this.docDecp========>", this.docDecp);
    })
  }

  doctorList: any;
  select(departmentName){
    console.log("departmentName----->", departmentName);
    this.http.post(this._com.baseUrl+'/getDoctorByDepartmentName', {adminId: localStorage.getItem('adminId'), department: departmentName}).subscribe(result =>{
    this.doctorList = result;
    console.log("this.adminId: localStorage.getItem('adminId'), ----->", this.doctorList);
   })      
  }

  oneDoctor: any;
  doctorCharges1: any;
  doctorCharges2: any;
  doctorCharges3: any; 
  doctorDetail: array;
  doctorSelect(selectDoctorId){
  this.http.post(this._com.baseUrl+'/getOneDoctor', {adminId: localStorage.getItem('adminId'), doctorId: selectDoctorId}).subscribe(result =>{
    this.oneDoctor = result;
    //this.doctorDetail = this.oneDoctor.data;
    //this.doctorCharges1 = this.doctorDetail.opdCharge1;
    //this.doctorCharges2 = this.doctorDetail.opdCharge2;
    //this.doctorCharges3 = this.doctorDetail.opdCharge3;
   })
  }

  patientAllStatus: any;
  patientStatus(){
    this.http.get(this._com.baseUrl+'/getPatientStatus').subscribe( result => {
      this.patientAllStatus = result;
        //this.stateData = this.patientAllStatus.data;
    })
  } 

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }  


  openDialog(): void {
    const dialogRef = this.dialog.open(IpdPatientAddBed, {
      width: '650px',
       data: { patientAdmissionId: this.paramValue}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getOneAdmitPatient();
    });
  }


  bedUpdateDialog(PatientBedId, datam): void {
  let dialogRef;
    if(datam == 'delete'){
      dialogRef = this.dialog.open(IpdPatientUpdateBed, {
        width: '400px',
         data: { PatientBedId: PatientBedId, datam: datam}
      });    
    }
    else{
      dialogRef = this.dialog.open(IpdPatientUpdateBed, {
        width: '650px',
         data: { PatientBedId: PatientBedId}
      });
    }

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getOneAdmitPatient();
    });
  }

  openDialogOperation(): void {
    const dialogRef = this.dialog.open(IpdPatientAddOperation, {
      width: '650px',
       data: { patientAdmissionId: this.paramValue}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getOneAdmitPatient();
    });
  }

 openDialogOperationUpdate(patientOperationId, datam): void {
 let dialogRef;
    if(datam == 'delete'){
      dialogRef = this.dialog.open(IpdPatientUpdateOperation, {
        width: '400px',
         data: { patientOperationId: patientOperationId, datam: datam}
      });
    }
    else{
      dialogRef = this.dialog.open(IpdPatientUpdateOperation, {
        width: '650px',
         data: { patientOperationId: patientOperationId}
      });    
    }  

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getOneAdmitPatient();
    });
  }

  openDialogDiagnosis(): void {
    const dialogRef = this.dialog.open(IpdPatientAddDiagnosis, {
      width: '650px',
       data: { patientAdmissionId: this.paramValue}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getOneAdmitPatient();
    });
  }

 openDialogDiagnosisUpdate(patientDiagnosisId, datam): void {
 let dialogRef;
    if(datam == 'delete'){
      dialogRef = this.dialog.open(IpdPatientUpdateDiagnosis, {
        width: '400px',
         data: { patientDiagnosisId: patientDiagnosisId, datam: datam}
      });    
    }
    else{
      dialogRef = this.dialog.open(IpdPatientUpdateDiagnosis, {
        width: '650px',
         data: { patientDiagnosisId: patientDiagnosisId}
      });
    }

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getOneAdmitPatient();
    });
  }

  openDialogDoctorVisit(): void {
    const dialogRef = this.dialog.open(IpdPatientAddDoctorVisit, {
      width: '650px',
       data: { patientAdmissionId: this.paramValue}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getOneAdmitPatient();
    });
  }

  openDialogDoctorVisitPatientUpdate(patientVisitDoctorId, datam): void{
  let dialogRef;
    console.log("PatientVisitDoctorId======>", patientVisitDoctorId);
     if(datam == 'delete'){
        dialogRef = this.dialog.open(IpdPatientUpdateDoctorVisit, {
          width: '400px',
           data: { patientVisitDoctorId: patientVisitDoctorId, datam: datam}
        });     
     }
     else{
      dialogRef = this.dialog.open(IpdPatientUpdateDoctorVisit, {
        width: '650px',
         data: { patientVisitDoctorId: patientVisitDoctorId}
      });
     }

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getOneAdmitPatient();
    });    
  }

    hospitalD: any = {};
    hospitalD2: any = {};
    hositalDetail(){
      if(localStorage.getItem('adminId')){
        this.http.post(this._com.baseUrl+'/getOneAdmin', {adminId: localStorage.getItem('adminId')}).subscribe(
          result => {
            this.hospitalD = result;
            console.log("this.hospitalD=>", this.hospitalD);
            this.hospitalD2 = this.hospitalD.data;
            console.log("this.hospitalD2=>", this.hospitalD2);
          }
        )  
      }
    else{
      this.router.navigate(['/login']);
    }
    }

  bloodGroupList: any;
  getDataPBD: any;
  dataPBD: any = {};
  IpdpatientId: any;
  getOnePatientBsicDetail(patinetId){
    this.IpdpatientId = patinetId;
    this.http.post(this._com.baseUrl+'/getOnePatientBasicDetail',{IpdpatientId: patinetId}).subscribe(result =>{
      this.getDataPBD = result;
      if(this.getDataPBD.resCode == 200){
        this.dataPBD = this.getDataPBD.data;
        this.selectCity(this.dataPBD.state);
        console.log("res status=1> ", this.dataPBD);
      }
      else{
        console.log("res status=2> ", this.getDataPBD.resMsg);
        return false;
      }
    })  
  }



  stateData: any;
  cityData: any;
  dayData: any;
  state(){
    this.http.get('https://node-pos.herokuapp.com/state').subscribe( result => {
      this.stateData = result;
      console.log("======this.stateData======", this.stateData);
        //this.stateData = this.stateDatas.data;
    })
  }


  selectCity(stateid){
    console.log("stateid----->", stateid);
    this.http.post("https://node-pos.herokuapp.com/city", {state: stateid}).subscribe(result =>{
    this.cityData = result;
    console.log("this.cityData----->", this.cityData);
   })      
  }

  // Angular 2 encode image to base64

  changeListener($event) : void {
    this.readThis($event.target);
  }
   
   image: any;
  readThis(inputValue: any): void {
    var file:File = inputValue.files[0];
    var myReader:FileReader = new FileReader();
    console.log("myReader==>", myReader);

    myReader.onloadend = (e) => {
      this.image = myReader.result;
      console.log("this.image==>", this.image);
    }
    myReader.readAsDataURL(file);
  }

  onSubmitUpdate(value){
    console.log("-value-", value);
    if (this.formUpdate.valid) {
        this.http.post(this._com.baseUrl+'/updatePatient', {adminId: localStorage.getItem('adminId'), IpdpatientId: this.IpdpatientId, name: value.name, gender: value.gender, referenceBy: value.referenceBy, dob: value.dob, mobileNo1: value.mobileNo1, mobileNo2: value.mobileNo2, relativeName: value.relativeName, relativeNumber: value.relativeNumber, address: value.address, state: value.state, city: value.city, pinCode: value.pinCode, bloodGroup: value.bloodGroup, img: this.image}).subscribe(
          result => {
            this.outPut = result;
            console.log("this.outPut=======>", this.outPut);
            if(this.outPut.resCode == 200){
              console.log("200=======");
              this.router.navigate(['/form-controls/slide-toggle']);
            }
            else{
              this.errMsg = "true";
              console.log("400=======");
            }
          }
        )
    }

  }


}



//---------------------------------------------------------- ADD BED ------------------------------------------//


@Component({
  providers:[UpdateAdmitPatientComponent],
  selector: 'ipd-patient-add-bed',
  templateUrl: 'ipd-patient-add-bed.html',
  styleUrls: ['./common.scss'],
})

export class IpdPatientAddBed {
  
  public form:FormGroup;
  constructor(public ampCom: UpdateAdmitPatientComponent, public dialogRef: MatDialogRef<IpdPatientAddBed>, @Inject(MAT_DIALOG_DATA) public data: any, public fb: FormBuilder, public http: HttpClient, public router: Router, private activatedRoute : ActivatedRoute, public _com: CommonService) { 

    this.form = this.fb.group({
      'bedCategoryId': [null, Validators.compose([Validators.required])],
      'bedId': [null, Validators.compose([Validators.required])], 
      'inDate': [null, Validators.compose([Validators.required])], 
      'outDate': '', 
      'perDayPrice': [null, Validators.compose([Validators.required])], 
      });

      this.getAllBedCategory();
      this.paramValueP =  this.data.patientVisitDoctorId
      console.log("this.paramValueP=====>", this.paramValueP);     
  }


  onNoClick(opdPID){
    //this.dialogRef.close();
    //  this.deleteOPDpatinet(opdPID);
  }
  public min = new Date();
  paramValue: any;
  paramValueP: any;

   perDayPrice: any;
   allBedC: any;
   getAllBedCategory(){
    this.http.post(this._com.baseUrl+'/getAllBedCategory', {adminId: localStorage.getItem('adminId')}).subscribe(
      result => {
        this.allBedC = result;
        console.log("this.allBedC=>", this.allBedC);
      }
    )
   }

   BedC: any;
   bedData: any
   allBed: any;
   bedPrice: any;
   getbed(evn){
   console.log("evn=>", evn);
    this.http.post(this._com.baseUrl+'/getAllBedBYBedCategory', {adminId: localStorage.getItem('adminId'), bedCategoryId: evn}).subscribe(
      result => {
        this.allBed = result;
        console.log("this.allBed=>", this.allBed);
      }) 

    this.http.post(this._com.baseUrl+'/getOneBedCategory', {bedCategoryId: evn}).subscribe(
      result => {
        this.BedC = result;
        this.bedData = this.BedC.data;
        this.bedPrice = this.bedData.price;
        console.log("this.BedC=>", this.BedC);
        console.log("this.bedData=>", this.bedData);
      })
   }
  
  getData: any;
  onSubmit(value){
   if (this.form.valid) {
    console.log("this.data.patientAdmissionId->", this.data.patientAdmissionId);
    this.http.post(this._com.baseUrl+'/patientBookBed',{adminId: localStorage.getItem('adminId'), patientAdmissionId: this.data.patientAdmissionId, bedCategoryId: value.bedCategoryId, bedId: value.bedId, inDate: value.inDate, outDate: value.outDate, perDayPrice: value.perDayPrice}).subscribe(result =>{
      this.getData = result;
      if(this.getData.resCode == 200){
        console.log("res status=> ", this.getData.resMsg);
        this.dialogRef.close();
        //this.ampCom.getOneAdmitP(this.paramValueP);
      }
      else{
        console.log("res status=> ", this.getData.resMsg);
        return false;
      }
    })
   }  
   else{
      return false;
   }
  }
}      

//------------------------------------------------------- UPDATE BED ----------------------------------------------//

interface obj {
    resCode: number;
    resMsg: string;
    data: any;
    tokan: any;
  }

@Component({
  providers:[UpdateAdmitPatientComponent],
  selector: 'ipd-patient-update-bed',
  templateUrl: 'ipd-patient-update-bed.html',
  styleUrls: ['./common.scss'],
})

export class IpdPatientUpdateBed {
  
  public form:FormGroup;
  constructor(public ampCom: UpdateAdmitPatientComponent, public dialogRef: MatDialogRef<IpdPatientUpdateBed>, @Inject(MAT_DIALOG_DATA) public data1: any, public fb: FormBuilder, public http: HttpClient, public router: Router, private activatedRoute : ActivatedRoute, public _com: CommonService) { 

    this.form = this.fb.group({
      'bedCategoryId': [null, Validators.compose([Validators.required])],
      'bedId': [null, Validators.compose([Validators.required])], 
      'inDate': [null, Validators.compose([Validators.required])], 
      'outDate': [null, Validators.compose([Validators.required])], 
      'perDayPrice': [null, Validators.compose([Validators.required])], 
      });

      this.getAllBedCategory();
      this.getOneBedDetail();
      this.datam = this.data1.datam;
      //this.paramValueP =  this.data.patientVisitDoctorId
      console.log("this.data1.PatientBedId=====>", this.data1.PatientBedId);     
  }

   paramValueP: any;
   pbd: any;
   data: any= {};
   datam: any;
   getOneBedDetail(){
    this.http.post(this._com.baseUrl+'/getOneAdmissionPatientBed', {adminId: localStorage.getItem('adminId'), PatientBedId: this.data1.PatientBedId}).subscribe(
      result => {
        this.pbd = result;
        this.data = this.pbd.data;
        this.getbed(this.data.bedCategoryId)
        console.log("this.pbd=>", this.pbd);
      }
    )
   }
   
   public min = new Date();
   perDayPrice: any;
   allBedC: any;
   getAllBedCategory(){
    this.http.post(this._com.baseUrl+'/getAllBedCategory', {adminId: localStorage.getItem('adminId')}).subscribe(
      result => {
        this.allBedC = result;
        console.log("this.allBedC=>", this.allBedC);
      }
    )
   }

   BedC: any;
   bedData: any
   allBed: any;
   bedPrice: any;
   getbed(evn){
   console.log("evn=>", evn);
    this.http.post(this._com.baseUrl+'/getAllBedBYBedCategory', {adminId: localStorage.getItem('adminId'), bedCategoryId: evn}).subscribe(
      result => {
        this.allBed = result;
        console.log("this.allBed=>", this.allBed);
      }) 

    this.http.post(this._com.baseUrl+'/getOneBedCategory', {bedCategoryId: evn}).subscribe(
      result => {
        this.BedC = result;
        this.bedData = this.BedC.data;
        this.bedPrice = this.bedData.price;
        console.log("this.BedC=>", this.BedC);
        console.log("this.bedData=>", this.bedData);
      })
   }
  
  getData: any;
  onSubmit(value){
   if (this.form.valid) {
    console.log("this.data1.PatientBedId->", this.data1.PatientBedId);
    this.http.post(this._com.baseUrl+'/updatePatientBookBed',{adminId: localStorage.getItem('adminId'), patientBookBedId: this.data1.PatientBedId, bedCategoryId: value.bedCategoryId, bedId: value.bedId, inDate: value.inDate, outDate: value.outDate, perDayPrice: value.perDayPrice}).subscribe(result =>{
      this.getData = result;
      if(this.getData.resCode == 200){
        console.log("res status=> ", this.getData.resMsg);
        this.dialogRef.close();
        //this.ampCom.getOneAdmitP(this.paramValueP);
      }
      else{
        console.log("res status=> ", this.getData.resMsg);
        return false;
      }
    })
   }  
   else{
      return false;
   }
  }

  deleteData: any;
  onNoClickDelete(idValue): void{
    this.http.post(this._com.baseUrl+'/deletePatientBed', {adminId: localStorage.getItem('adminId'), PatientBedId: idValue}).subscribe(
      result => {
        this.deleteData = result;
        if(this.deleteData.resCode == 200){
          this.dialogRef.close();
        }
        else{
           return false;
        }
      }
    )
  } 


}      


//------------------------------------------------------- ADD OPERATIONS ----------------------------------------//


@Component({
  providers:[UpdateAdmitPatientComponent],
  selector: 'ipd-patient-add-operation',
  templateUrl: 'ipd-patient-add-operation.html',
  styleUrls: ['./common.scss'],
})

export class IpdPatientAddOperation {
  
  public form:FormGroup;
  constructor(public ampCom: UpdateAdmitPatientComponent, public dialogRef: MatDialogRef<IpdPatientAddOperation>, @Inject(MAT_DIALOG_DATA) public data: any, public fb: FormBuilder, public http: HttpClient, public router: Router, private activatedRoute : ActivatedRoute, public _com: CommonService) { 

    this.form = this.fb.group({
      'operationId': [null, Validators.compose([Validators.required])],
      'operationCharges': [null, Validators.compose([Validators.required])], 
      'operationDate': [null, Validators.compose([Validators.required])], 
      'description': [null, Validators.compose([Validators.required])], 
      'referenceDoctorId': [null, Validators.compose([Validators.required])], 
      });

      this.getAllDoctor();
      this.getAllOperation();
      this.paramValueP =  this.data.patientVisitDoctorId
      console.log("this.paramValueP=====>", this.paramValueP);     
  }


  onNoClick(opdPID){
    //this.dialogRef.close();
    this.deleteOPDpatinet(opdPID);
  }
  public min = new Date();
  paramValue: any;
  paramValueP: any;
  outPut: any={};
  deleteOPDpatinet(opdPID){
    console.log("opdPID------2----->",opdPID);
    this.http.post(this._com.baseUrl+'/deleteOpdPatient', {adminId: localStorage.getItem('adminId'), opdPatientId: opdPID}).subscribe(
      result => {
        this.outPut = result;
        if(this.outPut.resCode == 200){
          this.router.navigate(['/master/all-patient']);
          //this.dialogRef.close();
        }
        else{
          console.log("400===e====", this.outPut);
        }
      }      
    )    
   }


   allDoctor: any;
   getAllDoctor(){
    this.http.post(this._com.baseUrl+'/getAllDoctor', {adminId: localStorage.getItem('adminId')}).subscribe(
      result => {
        this.allDoctor = result;
        console.log("this.allDoctor=>", this.allDoctor);
      }
    )
   }

   allOpration: any;
   getAllOperation(){
    this.http.post(this._com.baseUrl+'/getAllOperation', {adminId: localStorage.getItem('adminId')}).subscribe(
      result => {
        this.allOpration = result;
        console.log("this.allOpration=>", this.allOpration);
      }
    )
   }



   op: any;
   opData: any
   opCharges: any;
   selectCh(evn){
   console.log("evn=>", evn); 

    this.http.post(this._com.baseUrl+'/getOneOperation', {adminId: localStorage.getItem('adminId'), operationId: evn}).subscribe(
      result => {
        this.op = result;
        this.opData = this.op.data;
        console.log("this.op=>", this.op);        
        this.opCharges = this.opData.operationCharges;
        console.log("this.opCharges=>", this.opCharges);
      })
   }
  
  getData: any;
  onSubmit(value){
   if (this.form.valid) {
    console.log("this.data.patientAdmissionId->", this.data.patientAdmissionId);
    this.http.post(this._com.baseUrl+'/createPatientOperation',{adminId: localStorage.getItem('adminId'), patientAdmissionId: this.data.patientAdmissionId, operationId: value.operationId, operationCharges: value.operationCharges, referenceDoctorId: value.referenceDoctorId, operationDate: value.operationDate, description: value.description}).subscribe(result =>{
      this.getData = result;
      if(this.getData.resCode == 200){
        console.log("res status=> ", this.getData.resMsg);
        this.dialogRef.close();
        //this.ampCom.getOneAdmitP(this.paramValueP);
      }
      else{
        console.log("res status=> ", this.getData.resMsg);
        return false;
      }
    })
   }  
   else{
      return false;
   }
  }
}


//-------------------------------------------------- Update OPERATIONS ------------------------------------------//


@Component({
  providers:[UpdateAdmitPatientComponent],
  selector: 'ipd-patient-update-operation',
  templateUrl: 'ipd-patient-update-operation.html',
  styleUrls: ['./common.scss'],
})

export class IpdPatientUpdateOperation {
  
  public form:FormGroup;
  constructor(public ampCom: UpdateAdmitPatientComponent, public dialogRef: MatDialogRef<IpdPatientUpdateOperation>, @Inject(MAT_DIALOG_DATA) public data: any, public fb: FormBuilder, public http: HttpClient, public router: Router, private activatedRoute : ActivatedRoute, public _com: CommonService) { 

    this.form = this.fb.group({
      'operationId': [null, Validators.compose([Validators.required])],
      'operationCharges': [null, Validators.compose([Validators.required])], 
      'operationDate': [null, Validators.compose([Validators.required])], 
      'description': [null, Validators.compose([Validators.required])], 
      'referenceDoctorId': [null, Validators.compose([Validators.required])], 
      });

      this.getAllDoctor();
      this.getAllOperation();
      this.getOnePatientOperation();
      this.datam = this.data.datam;
      this.paramValueP =  this.data.patientVisitDoctorId
      console.log("this.paramValueP=====>", this.paramValueP);    
  }


  onNoClick(opdPID){
    //this.dialogRef.close();
   // this.deleteOPDpatinet(opdPID);
  }
  public min = new Date();
  datam: any;
  paramValue: any;
  paramValueP: any;

   allDoctor: any;
   getAllDoctor(){
    this.http.post(this._com.baseUrl+'/getAllDoctor', {adminId: localStorage.getItem('adminId')}).subscribe(
      result => {
        this.allDoctor = result;
        console.log("this.allDoctor=>", this.allDoctor);
      }
    )
   }

   allOpration: any;
   getAllOperation(){
    this.http.post(this._com.baseUrl+'/getAllOperation', {adminId: localStorage.getItem('adminId')}).subscribe(
      result => {
        this.allOpration = result;
        console.log("this.allOpration=>", this.allOpration);
      }
    )
   }

   op: any;
   opData: any
   opCharges: any;
   selectCh(evn){
   console.log("evn=>", evn); 

    this.http.post(this._com.baseUrl+'/getOneOperation', {adminId: localStorage.getItem('adminId'), operationId: evn}).subscribe(
      result => {
        this.op = result;
        this.opData = this.op.data;
        console.log("this.op=>", this.op);        
        this.opCharges = this.opData.operationCharges;
        console.log("this.opCharges=>", this.opCharges);
      })
   }
  
   pbd: any;
   dataOp: any={};
   getOnePatientOperation(){
    this.http.post(this._com.baseUrl+'/getOnePatientOperation', {adminId: localStorage.getItem('adminId'), patientOperationId: this.data.patientOperationId}).subscribe(
      result => {
        this.pbd = result;
        console.log("this.pbd=>", this.pbd);
        this.dataOp = this.pbd.data;
        this.opCharges = this.dataOp.operationCharges;
      }
    )
   }

  getData: any;
  onSubmit(value){
   if (this.form.valid) {
    console.log("this.data.patientAdmissionId->", this.data.patientAdmissionId);
    this.http.post(this._com.baseUrl+'/updatePatientOperation',{adminId: localStorage.getItem('adminId'), patientOperationId: this.data.patientOperationId, operationId: value.operationId, operationCharges: value.operationCharges, referenceDoctorId: value.referenceDoctorId, operationDate: value.operationDate, description: value.description}).subscribe(result =>{
      this.getData = result;
      if(this.getData.resCode == 200){
        console.log("res status=> ", this.getData.resMsg);
        this.dialogRef.close();
        //this.ampCom.getOneAdmitP(this.paramValueP);
      }
      else{
        console.log("res status=> ", this.getData.resMsg);
        return false;
      }
    })
   }  
   else{
      return false;
   }
  }

  deleteData: any;
  onNoClickDelete(idValue): void{
    this.http.post(this._com.baseUrl+'/deletePatienOperation', {adminId: localStorage.getItem('adminId'), operationId: idValue}).subscribe(
      result => {
        this.deleteData = result;
        if(this.deleteData.resCode == 200){
          this.dialogRef.close();
        }
        else{
           return false;
        }
      }
    )
  }

}


//------------------------------------------------------- ADD DIAGNOSIS ------------------------------------------//


@Component({
  providers:[UpdateAdmitPatientComponent],
  selector: 'ipd-patient-add-diagnosis',
  templateUrl: 'ipd-patient-add-diagnosis.html',
  styleUrls: ['./common.scss'],
})

export class IpdPatientAddDiagnosis {
  
  public form:FormGroup;
  constructor(public ampCom: UpdateAdmitPatientComponent, public dialogRef: MatDialogRef<IpdPatientAddDiagnosis>, @Inject(MAT_DIALOG_DATA) public data: any, public fb: FormBuilder, public http: HttpClient, public router: Router, private activatedRoute : ActivatedRoute, public _com: CommonService) { 

    this.form = this.fb.group({
      'diagnosisId': [null, Validators.compose([Validators.required])],
      'diagnosisPrice': [null, Validators.compose([Validators.required])], 
      //'operationDate': [null, Validators.compose([Validators.required])], 
      'description': [null, Validators.compose([Validators.required])], 
      'referenceDoctorId': [null, Validators.compose([Validators.required])], 
      });

      this.getAllDoctor();
      this.getAllDiagnosis();
      this.paramValueP =  this.data.patientVisitDoctorId
      console.log("this.paramValueP=====>", this.paramValueP);   
  }

  public min = new Date();
  paramValue: any;
  paramValueP: any;

   allDoctor: any;
   getAllDoctor(){
    this.http.post(this._com.baseUrl+'/getAllDoctor', {adminId: localStorage.getItem('adminId')}).subscribe(
      result => {
        this.allDoctor = result;
        console.log("this.allDoctor=>", this.allDoctor);
      }
    )
   }

   allDiagnosis: any;
   getAllDiagnosis(){
    this.http.post(this._com.baseUrl+'/getAllDiagnosis', {adminId: localStorage.getItem('adminId')}).subscribe(
      result => {
        this.allDiagnosis = result;
        console.log("this.allDiagnosis=>", this.allDiagnosis);
      }
    )
   }



   op: any;
   opData: any
   opCharges: any;
   selectCh(evn){
   console.log("evn=>", evn); 

    this.http.post(this._com.baseUrl+'/getOneDiagnosis', {adminId: localStorage.getItem('adminId'), diagnosisId: evn}).subscribe(
      result => {
        this.op = result;
        console.log("this.op=>", this.op); 
        this.opData = this.op.data;
        this.opCharges = this.opData.diagnosisPrice;
        console.log("this.opCharges=>", this.opCharges);
      })
   }
  
  getData: any;
  onSubmit(value){
   if (this.form.valid) {
    console.log("this.data.patientAdmissionId->", this.data.patientAdmissionId);
    this.http.post(this._com.baseUrl+'/createPatientdiagnosis',{adminId: localStorage.getItem('adminId'), patientAdmissionId: this.data.patientAdmissionId, diagnosisId: value.diagnosisId, diagnosisPrice: value.diagnosisPrice, referenceDoctorId: value.referenceDoctorId, description: value.description}).subscribe(result =>{
      this.getData = result;
      if(this.getData.resCode == 200){
        console.log("res status=> ", this.getData.resMsg);
        this.dialogRef.close();
        //this.ampCom.getOneAdmitP(this.paramValueP);
      }
      else{
        console.log("res status=> ", this.getData.resMsg);
        return false;
      }
    })
   }  
   else{
      return false;
   }
  }
}


//--------------------------------------------------- UPDATE DIAGNOSIS ------------------------------------------//


@Component({
  providers:[UpdateAdmitPatientComponent],
  selector: 'ipd-patient-update-diagnosis',
  templateUrl: 'ipd-patient-update-diagnosis.html',
  styleUrls: ['./common.scss'],
})

export class IpdPatientUpdateDiagnosis {
  
  public form:FormGroup;
  constructor(public ampCom: UpdateAdmitPatientComponent, public dialogRef: MatDialogRef<IpdPatientUpdateDiagnosis>, @Inject(MAT_DIALOG_DATA) public data: any, public fb: FormBuilder, public http: HttpClient, public router: Router, private activatedRoute : ActivatedRoute, public _com: CommonService) { 

    this.form = this.fb.group({
      'diagnosisId': [null, Validators.compose([Validators.required])],
      'diagnosisPrice': [null, Validators.compose([Validators.required])], 
      //'operationDate': [null, Validators.compose([Validators.required])], 
      'description': [null, Validators.compose([Validators.required])], 
      'referenceDoctorId': [null, Validators.compose([Validators.required])], 
      });

      this.getAllDoctor();
      this.getAllDiagnosis();
      this.getOnePatientDiagnosis()
      this.paramValueP =  this.data.patientVisitDoctorId
      this.datam = this.data.datam;
      console.log("this.paramValueP=====>", this.paramValueP);     
  }

  public min = new Date();
  paramValue: any;
  paramValueP: any;
  datam: any;

   allDoctor: any;
   getAllDoctor(){
    this.http.post(this._com.baseUrl+'/getAllDoctor', {adminId: localStorage.getItem('adminId')}).subscribe(
      result => {
        this.allDoctor = result;
        console.log("this.allDoctor=>", this.allDoctor);
      }
    )
   }

   allDiagnosis: any;
   getAllDiagnosis(){
    this.http.post(this._com.baseUrl+'/getAllDiagnosis', {adminId: localStorage.getItem('adminId')}).subscribe(
      result => {
        this.allDiagnosis = result;
        console.log("this.allDiagnosis=>", this.allDiagnosis);
      }
    )
   }



   op: any;
   opData: any
   opCharges: any;
   selectCh(evn){
   console.log("evn=>", evn); 

    this.http.post(this._com.baseUrl+'/getOneDiagnosis', {adminId: localStorage.getItem('adminId'), diagnosisId: evn}).subscribe(
      result => {
        this.op = result;
        console.log("this.op=>", this.op); 
        this.opData = this.op.data;
        this.opCharges = this.opData.diagnosisPrice;
        console.log("this.opCharges=>", this.opCharges);
      })
   }

   pbd: any;
   dataOp: any={};
   getOnePatientDiagnosis(){
    this.http.post(this._com.baseUrl+'/getOnePatientDiagnosis', {adminId: localStorage.getItem('adminId'), patientDiagnosisId: this.data.patientDiagnosisId}).subscribe(
      result => {
        this.pbd = result;
        console.log("this.pbd=>", this.pbd);
        this.dataOp = this.pbd.data;
        this.opCharges = this.dataOp.diagnosisPrice;
      }
    )
   }   
  
  getData: any;
  onSubmit(value){
   if (this.form.valid) {
    console.log("this.data.patientAdmissionId->", this.data.patientAdmissionId);
    this.http.post(this._com.baseUrl+'/updatePatientdiagnosis',{adminId: localStorage.getItem('adminId'), patientDiagnosisId: this.data.patientDiagnosisId, diagnosisId: value.diagnosisId, diagnosisPrice: value.diagnosisPrice, referenceDoctorId: value.referenceDoctorId, description: value.description}).subscribe(result =>{
      this.getData = result;
      if(this.getData.resCode == 200){
        console.log("res status=> ", this.getData.resMsg);
        this.dialogRef.close();
        //this.ampCom.getOneAdmitP(this.paramValueP);
      }
      else{
        console.log("res status=> ", this.getData.resMsg);
        return false;
      }
    })
   }  
   else{
      return false;
   }
  }


  deleteData: any;
  onNoClickDelete(idValue): void{
    this.http.post(this._com.baseUrl+'/deletePatientDiagnosis', {adminId: localStorage.getItem('adminId'), diagnosisId: idValue}).subscribe(
      result => {
        this.deleteData = result;
        if(this.deleteData.resCode == 200){
          this.dialogRef.close();
        }
        else{
           return false;
        }
      }
    )
  }

}

//---------------------------------------------------- ADD DOCTOR VISIT ------------------------------------------//


@Component({
  providers:[UpdateAdmitPatientComponent],
  selector: 'ipd-patient-add-doctor-visit',
  templateUrl: 'ipd-patient-add-doctor-visit.html',
  styleUrls: ['./common.scss'],
})

export class IpdPatientAddDoctorVisit {
  
  public form:FormGroup;
  constructor(public ampCom: UpdateAdmitPatientComponent, public dialogRef: MatDialogRef<IpdPatientAddDiagnosis>, @Inject(MAT_DIALOG_DATA) public data: any, public fb: FormBuilder, public http: HttpClient, public router: Router, private activatedRoute : ActivatedRoute, public _com: CommonService) { 

    this.form = this.fb.group({
      'doctorId': [null, Validators.compose([Validators.required])],
      'doctorVisitPrice': [null, Validators.compose([Validators.required])], 
      'visitDate': [null, Validators.compose([Validators.required])], 
      'description': [null, Validators.compose([Validators.required])], 
      // 'referenceDoctorId': [null, Validators.compose([Validators.required])], 
      });

      this.getAllDoctor();
      this.getAllDiagnosis();
      this.paramValueP =  this.data.patientVisitDoctorId
      console.log("this.paramValueP=====>", this.paramValueP);     
  }

  public min = new Date();
  paramValue: any;
  paramValueP: any;

   allDoctor: any;
   getAllDoctor(){
    this.http.post(this._com.baseUrl+'/getAllDoctor', {adminId: localStorage.getItem('adminId')}).subscribe(
      result => {
        this.allDoctor = result;
        console.log("this.allDoctor=>", this.allDoctor);
      }
    )
   }

   allDiagnosis: any;
   getAllDiagnosis(){
    this.http.post(this._com.baseUrl+'/getAllDiagnosis', {adminId: localStorage.getItem('adminId')}).subscribe(
      result => {
        this.allDiagnosis = result;
        console.log("this.allDiagnosis=>", this.allDiagnosis);
      }
    )
   }



   op: any;
   opData: any
   ipdCharge: any;
   selectCh(evn){
   console.log("evn=>", evn); 

    this.http.post(this._com.baseUrl+'/getOneDoctor', {adminId: localStorage.getItem('adminId'), doctorId: evn}).subscribe(
      result => {
        this.op = result;
        console.log("this.op=>", this.op); 
        this.opData = this.op.data;
        this.ipdCharge = this.opData.ipdCharge;
        console.log("this.ipdCharge=>", this.ipdCharge);
      })
   }
  
  getData: any;
  onSubmit(value){
   if (this.form.valid) {
    console.log("this.data.patientAdmissionId->", this.data.patientAdmissionId);
    this.http.post(this._com.baseUrl+'/createPatientVisitDoctor',{adminId: localStorage.getItem('adminId'), patientAdmissionId: this.data.patientAdmissionId, doctorId: value.doctorId, doctorVisitPrice: value.doctorVisitPrice, visitDate: value.visitDate, description: value.description}).subscribe(result =>{
      this.getData = result;
      if(this.getData.resCode == 200){
        console.log("res status=> ", this.getData.resMsg);
        this.dialogRef.close();
        //this.ampCom.getOneAdmitP(this.paramValueP);
      }
      else{
        console.log("res status=> ", this.getData.resMsg);
        return false;
      }
    })
   }  
   else{
      return false;
   }
  }
}



//---------------------------------------------------- UPDATE DOCTOR VISIT ------------------------------------------//


@Component({
  providers:[UpdateAdmitPatientComponent],
  selector: 'ipd-patient-update-doctor-visit',
  templateUrl: 'ipd-patient-update-doctor-visit.html',
  styleUrls: ['./common.scss'],
})

export class IpdPatientUpdateDoctorVisit {
  
  public form:FormGroup;
  constructor(public ampCom: UpdateAdmitPatientComponent, public dialogRef: MatDialogRef<IpdPatientUpdateDoctorVisit>, @Inject(MAT_DIALOG_DATA) public data: any, public fb: FormBuilder, public http: HttpClient, public router: Router, private activatedRoute : ActivatedRoute, public _com: CommonService) { 

    this.form = this.fb.group({
      'doctorId': [null, Validators.compose([Validators.required])],
      'doctorVisitPrice': [null, Validators.compose([Validators.required])], 
      'visitDate': [null, Validators.compose([Validators.required])], 
      'description': [null, Validators.compose([Validators.required])], 
      // 'referenceDoctorId': [null, Validators.compose([Validators.required])], 
      });

      this.getAllDoctor();
      this.getAllDiagnosis();
      this.getOneDoctorVisitPatient();
      this.datam = this.data.datam;
      this.paramValueP =  this.data.patientVisitDoctorId
      //console.log("this.ampCom.paramValue=====>", this.ampCom.paramValue);     
  }

  public min = new Date();
  datam: any;
  paramValueP: any;

   allDoctor: any;
   getAllDoctor(){
    this.http.post(this._com.baseUrl+'/getAllDoctor', {adminId: localStorage.getItem('adminId')}).subscribe(
      result => {
        this.allDoctor = result;
        console.log("this.allDoctor=>", this.allDoctor);
      }
    )
   }

   allDiagnosis: any;
   getAllDiagnosis(){
    this.http.post(this._com.baseUrl+'/getAllDiagnosis', {adminId: localStorage.getItem('adminId')}).subscribe(
      result => {
        this.allDiagnosis = result;
        console.log("this.allDiagnosis=>", this.allDiagnosis);
      }
    )
   }



   op: any;
   opData: any
   ipdCharge: any;
   selectCh(evn){
   console.log("evn=>", evn); 
    this.http.post(this._com.baseUrl+'/getOneDoctor', {adminId: localStorage.getItem('adminId'), doctorId: evn}).subscribe(
      result => {
        this.op = result;
        console.log("this.op=>", this.op); 
        this.opData = this.op.data;
        this.ipdCharge = this.opData.ipdCharge;
        console.log("this.ipdCharge=>", this.ipdCharge);
      })
   }
  
   pbd: any;
   dataOp: any;
   patientAId: any;
   getOneDoctorVisitPatient(){
    this.http.post(this._com.baseUrl+'/getOnPatientVisitDoctor', {adminId: localStorage.getItem('adminId'), patientVisitDoctorId: this.data.patientVisitDoctorId}).subscribe(
      result => {
        this.pbd = result;
        console.log("this.pbd=>", this.pbd);
        this.dataOp = this.pbd.data;
        this.patientAId = this.dataOp.patientAdmissionId;
        this.ipdCharge = this.dataOp.doctorVisitPrice;
      }
    )
   }   

  getData: any;
  onSubmit(value){
   if (this.form.valid) {
    console.log("this.paramValueP->", this.paramValueP);
    this.http.post(this._com.baseUrl+'/updatePatientVisitDoctor',{adminId: localStorage.getItem('adminId'), patientVisitDoctorId: this.data.patientVisitDoctorId, doctorId: value.doctorId, doctorVisitPrice: value.doctorVisitPrice, visitDate: value.visitDate, description: value.description}).subscribe(result =>{
      this.getData = result;
      if(this.getData.resCode == 200){
        console.log("res status=> ", this.getData.resMsg);
        this.dialogRef.close();
        console.log("this.patientAId==)))))))))===>", this.patientAId);
        this.ampCom.getOneAdmitP(this.patientAId);
      }
      else{
        console.log("res status=> ", this.getData.resMsg);
        return false;
      }
    })
   }  
   else{
      return false;
   }
  }

  deleteData: any;
  onNoClickDelete(idValue): void{
    this.http.post(this._com.baseUrl+'/deletePatientDoctorVisit', {adminId: localStorage.getItem('adminId'), patientVisitDoctorId: idValue}).subscribe(
      result => {
        this.deleteData = result;
        if(this.deleteData.resCode == 200){
          this.dialogRef.close();
        }
        else{
           return false;
        }
      }
    )
  }


}
