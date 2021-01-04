import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Member } from '../shared/member';
import { FirebaseService } from '../services/firebase.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable, Subject, Observer } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { FormControl } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';

import * as _moment from 'moment';
import {default as _rollupMoment} from 'moment';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};


@Component({
  selector: 'app-edit-member',
  templateUrl: './edit-member.component.html',
  styleUrls: ['./edit-member.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class EditMemberComponent implements OnInit {

  item: any;
  id: any;

  memberForm: FormGroup;
  member: Member;
  uploaded: string = null;
  uploadedPassport: string = null;
  uploadedId: string = null;
  files: File[] = [];
  file: File;
  // picker_date = new FormControl(moment());
  date;

  task: AngularFireUploadTask;
  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: string;

  task2: AngularFireUploadTask;
  percentage2: Observable<number>;
  snapshot2: Observable<any>;
  downloadURL2: string;

  task3: AngularFireUploadTask;
  percentage3: Observable<number>;
  snapshot3: Observable<any>;
  downloadURL3: string;

  public showWebcam = false;
  public showWebcamPassport = false;
  public showWebcamId = false;

  public allowCameraSwitch = false;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  public errors: WebcamInitError[] = [];
  public webcamImage: WebcamImage = null;
  public webcamImagePassport: WebcamImage = null;
  public webcamImageId: WebcamImage = null;
  private trigger: Subject<void> = new Subject<void>();
  private triggerPassport: Subject<void> = new Subject<void>();
  private triggerId: Subject<void> = new Subject<void>();
  private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();


  @ViewChild('fform') memberFormDirective;

  formErrors = {
    'id': '',
    'TC': '',
    'passport': '',
    'seriNo': '',
    'council_Id': '',
    'nameAR': '',
    'nameTR': '',
    'lastnameAR': '',
    'lastnameTR': '',
    'fatherAR': '',
    'fatherTR': '',
    'motherAR': '',
    'motherTR': '',
    'placeBirthAR': '',
    'placeBirthTR': '',
    'dateBirth': '',
    'cityAR': '',
    'cityTR': '',
    'currentAdressAR': '',
    'currentAdressTR': '',
    'laterAdressAR': '',
    'laterAdressTR': '',
    'phone': '',
    'whatsApp': '',
    'otherNationalityAR': '',
    'otherNationalityTR': '',
    'educationAR': '',
    'educationTR': '',
    'marriedAR': '',
    'marriedTR': '',
    'foundationWorkAR': '',
    'foundationWorkTR': '',
    'family_foundationWorkAR': '',
    'family_foundationWorkTR': '',
    'wife_Name_AR': '',
    'wife_Name_TR': '',
    'numberChildren': '',
    'roomRecord': '',
    'relative_roomRecord': '',
  };

  
  validationMessages = {
    'id': {
      'required': 'code is required.',
    },
    'TC': {
      'required': 'TC Numarası zorunlu',
      'pattern': 'TC Numarası sadece rakamlardan oluşmalıdır',
      'minlength': 'TC Numarası 11 hane olmalıdır',
      'maxlength': 'Maksimum TC sayısı 11 hanedir'
    },
    'passport': {
      'required': 'code is required.',
    },
    'seriNo': {
      'required': 'code is required.',
    },
    'council_Id': {
      'required': 'MECLİS kimlik Numarası zorunlu',
      'pattern': 'MECLİS kimlik Numarası sadece rakamlardan oluşmalıdır',
      'minlength': 'MECLİS kimlik Numarası 11 hane olmalıdır',
      'maxlength': 'Maksimum MECLİS kimlik sayısı 11 hanedir'
    },
    'nameAR': {
      'required': 'code is required.',
    },
    'nameTR': {
      'required': 'code is required.',
    },
    'lastnameAR': {
      'required': 'code is required.',
    },
    'lastnameTR': {
      'required': 'code is required.',
    },
    'fatherAR': {
      'required': 'code is required.',
    },
    'fatherTR': {
      'required': 'code is required.',
    },
    'motherAR': {
      'required': 'code is required.',
    },
    'motherTR': {
      'required': 'code is required.',
    },
    'placeBirthAR': {
      'required': 'code is required.',
    },
    'placeBirthTR': {
      'required': 'code is required.',
    },
    'dateBirth': {
      'required': 'code is required.',
    },
    'cityAR': {
      'required': 'code is required.',
    },
    'cityTR': {
      'required': 'code is required.',
    },
    'currentAdressAR': {
      'required': 'code is required.',
    },
    'currentAdressTR': {
      'required': 'code is required.',
    },
    'laterAdressAR': {
      'required': 'code is required.',
    },
    'laterAdressTR': {
      'required': 'code is required.',
    },
    'phone': {
      'required': 'code is required.',
    },
    'whatsApp': {
      'required': 'code is required.',
    },
    'otherNationalityAR': {
      'required': 'code is required.',
    },
    'otherNationalityTR': {
      'required': 'code is required.',
    },
    'educationAR': {
      'required': 'code is required.',
    },
    'educationTR': {
      'required': 'code is required.',
    },
    'marriedAR': {
      'required': 'code is required.',
    },
    'marriedTR': {
      'required': 'code is required.',
    },
    'foundationWorkAR': {
      'required': 'code is required.',
    },
    'foundationWorkTR': {
      'required': 'code is required.',
    },
    'family_foundationWorkAR': {
      'required': 'code is required.',
    },
    'family_foundationWorkTR': {
      'required': 'code is required.',
    },
    'wife_Name_AR': {
      'required': 'code is required.',
    },
    'wife_Name_TR': {
      'required': 'code is required.',
    },
    'numberChildren': {
      'required': 'code is required.',
    },
    'roomRecord': {
      'required': 'code is required.',
    },
    'relative_roomRecord': {
      'required': 'code is required.',
    },
  };


  constructor(    
    public authService: AuthService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private firebaseService: FirebaseService,
    public snackBar: MatSnackBar,
    public router: Router,
    private storage: AngularFireStorage,
    ) { }

  ngOnInit(): void {

    this.createForm();

    WebcamUtil.getAvailableVideoInputs()
    .then((mediaDevices: MediaDeviceInfo[]) => {
      this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
    });

    this.route.data.subscribe(routeData => {
      let data = routeData['data'];
      if (data) {
        this.item = data.payload.data();
        this.id = data.payload.id;
        this.downloadURL = data.payload.data().image;
        this.downloadURL2 = data.payload.data().passportImage;
        this.downloadURL3 = data.payload.data().idImage;
        this.date = data.payload.data().createdAt;
      }
    })
  }

    // Webcam ngx

    // Photo  
    public triggerSnapshot(): void {
      this.trigger.next();
      this.showWebcam = false;
    }
    public toggleWebcam(): void {
      this.showWebcam = false;
    }
    public handleImage(webcamImage: WebcamImage): void {
      this.webcamImage = webcamImage;
      this.downloadURL = this.webcamImage.imageAsDataUrl;
      this.uploaded = null;
      this.showWebcam = false;
    }
    openCamera() {
      this.showWebcam = true;
    }
    public get triggerObservable(): Observable<void> {
      return this.trigger.asObservable();
    }

      // Passport
  public triggerSnapshotPassport(): void {
    this.triggerPassport.next();
    this.showWebcamPassport = false;
  }
  public toggleWebcamPassport(): void {
    this.showWebcamPassport = false;
  }
  public handleImagePassport(webcamImage: WebcamImage): void {
    this.webcamImagePassport = webcamImage;
    this.downloadURL2 = this.webcamImagePassport.imageAsDataUrl;
    this.uploadedPassport = null;
    this.showWebcamPassport = false;
  }
  openCameraPassport() {
    this.showWebcamPassport = true;
  }
  public get triggerObservablePassport(): Observable<void> {
    return this.triggerPassport.asObservable();
  }



  // Id
  public triggerSnapshotId(): void {
    this.triggerId.next();
    this.showWebcamId = false;
  }
  public toggleWebcamId(): void {
    this.showWebcamId = false;
  }
  public handleImageId(webcamImage: WebcamImage): void {
    this.webcamImageId = webcamImage;
    this.downloadURL3 = this.webcamImageId.imageAsDataUrl;
    this.uploadedId = null;
    this.showWebcamId = false;
  }
  openCameraId() {
    this.showWebcamId = true;
  }
  public get triggerObservableId(): Observable<void> {
    return this.triggerId.asObservable();
  }

  

    public get nextWebcamObservable(): Observable<boolean|string> {
      return this.nextWebcam.asObservable();
    }
    public cameraWasSwitched(deviceId: string): void {
      this.deviceId = deviceId;
    }
    public handleInitError(error: WebcamInitError): void {
      this.errors.push(error);
    }
    public showNextWebcam(directionOrDeviceId: boolean|string): void {
      this.nextWebcam.next(directionOrDeviceId);
    }



  onDrop(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      this.files.push(files.item(i));
      this.file = this.files[i];
      this.startUpload(this.file);
    }
  }

  onDrop2(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      this.files.push(files.item(i));
      this.file = this.files[i];
      this.startUpload2(this.file);
    }
  }

  onDrop3(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      this.files.push(files.item(i));
      this.file = this.files[i];
      this.startUpload3(this.file);
    }
  }

  startUpload(file) {
    const path = `test/${Date.now()}_${file.name}`;
    const ref = this.storage.ref(path);
    this.task = this.storage.upload(path, file);
    this.percentage = this.task.percentageChanges();
    this.snapshot   = this.task.snapshotChanges().pipe(
      tap(console.log),
      finalize( async() =>  {
        this.uploaded = await ref.getDownloadURL().toPromise();
        this.downloadURL = this.uploaded;
        this.webcamImage = null;
        this.showWebcam = false;
        this.files = [];
      }),
    );
  }

  startUpload2(file) {
    const path = `test/${Date.now()}_${file.name}`;
    const ref = this.storage.ref(path);
    this.task2 = this.storage.upload(path, file);
    this.percentage2 = this.task2.percentageChanges();
    this.snapshot2   = this.task2.snapshotChanges().pipe(
      tap(console.log),
      finalize( async() =>  {
        this.uploadedPassport = await ref.getDownloadURL().toPromise();
        this.downloadURL2 = this.uploadedPassport;
        this.webcamImagePassport = null;
        this.showWebcamPassport = false;
        this.files = [];
      }),
    );
  }

  startUpload3(file) {
    const path = `test/${Date.now()}_${file.name}`;
    const ref = this.storage.ref(path);
    this.task3 = this.storage.upload(path, file);
    this.percentage3 = this.task3.percentageChanges();
    this.snapshot3   = this.task3.snapshotChanges().pipe(
      tap(console.log),
      finalize( async() =>  {
        this.uploadedId = await ref.getDownloadURL().toPromise();
        this.downloadURL3 = this.uploadedId;
        this.webcamImageId = null;
        this.showWebcamId = false;  
        this.files = [];
      }),
    );
  }

  createForm() {
    this.memberForm = this.fb.group({
      id: ['', [Validators.required]],
      TC: ['', [Validators.required, Validators.pattern, Validators.minLength(11), Validators.maxLength(11)]],
      passport: ['', [Validators.required]],
      seriNo: ['', [Validators.required]],
      council_Id: [null, [Validators.required, Validators.pattern, Validators.minLength(11), Validators.maxLength(11)]],
      nameAR: ['', [Validators.required]],
      nameTR: ['', [Validators.required]],
      lastnameAR: ['', [Validators.required]],
      lastnameTR: ['', [Validators.required]],
      fatherAR: ['', [Validators.required]],
      fatherTR: ['', [Validators.required]],
      motherAR: ['', [Validators.required]],
      motherTR: ['', [Validators.required]],
      placeBirthAR: ['', [Validators.required]],
      placeBirthTR: ['', [Validators.required]],
      dateBirth: ['', [Validators.required]],
      cityAR: ['', [Validators.required]],
      cityTR: ['', [Validators.required]],
      currentAdressAR: ['', [Validators.required]],
      currentAdressTR: ['', [Validators.required]],
      laterAdressAR: ['', [Validators.required]],
      laterAdressTR: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      whatsApp: ['', [Validators.required]],
      otherNationalityAR: ['', [Validators.required]],
      otherNationalityTR: ['', [Validators.required]],
      educationAR: ['', [Validators.required]],
      educationTR: ['', [Validators.required]],
      marriedAR: ['', [Validators.required]],
      marriedTR: ['', [Validators.required]],
      foundationWorkAR: ['', [Validators.required]],
      foundationWorkTR: ['', [Validators.required]],
      family_foundationWorkAR: ['', [Validators.required]],
      family_foundationWorkTR: ['', [Validators.required]],
      wife_Name_AR: ['', [Validators.required]],
      wife_Name_TR: ['', [Validators.required]],
      roomRecord: ['', [Validators.required]],
      relative_roomRecord: ['', [Validators.required]],
      // numberChildren: ['', [Validators.required]],
    });

    this.memberForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); //(re)set form validation messages 
  }
  onValueChanged(data?: any) {
    if (!this.memberForm) {
      return;
    }
    const form = this.memberForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous erroe message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit() {
    const formData = {
      ...this.memberForm.value,
      ...this.item,
      createdAt: this.date,
      image: this.downloadURL, 
      passportImage: this.downloadURL2,
      idImage: this.downloadURL3,
    };
    this.member = formData;
    console.log(this.member)
    this.firebaseService.updateMember('members', this.id, this.member)
    .then(
      res => {
        this.openSnackBar('Üye ' + this.member.nameTR + " Başarıyla güncellenmiştir...", '🙂')
        setTimeout(() => { this.router.navigate(['/members']); }, 3000);
      }
    )
    this.memberForm.reset({   
      id: '',
      TC: '',
      passport: '',
      seriNo: '',
      start_PermitDate: '',
      end_PermitDate: '',
      council_Id: '',
      nameAR: '',
      nameTR: '',
      lastnameAR: '',
      lastnameTR: '',
      fatherAR: '',
      fatherTR: '',
      motherAR: '',
      motherTR: '',
      placeBirthAR: '',
      placeBirthTR: '',
      dateBirth: '',
      cityAR: '',
      cityTR: '',
      currentAdressAR: '',
      currentAdressTR: '',
      laterAdressAR: '',
      laterAdressTR: '',
      phone: '',
      whatsApp: '',
      otherNationalityAR: '',
      otherNationalityTR: '',
      educationAR: '',
      educationTR: '',
      marriedAR: '',
      marriedTR: '',
      foundationWorkAR: '',
      foundationWorkTR: '',
      family_foundationWorkAR: '',
      family_foundationWorkTR: '',
      wife_Name_AR: '',
      wife_Name_TR: '',
      numberChildren: '',
      roomRecord: '',
      relative_roomRecord: '',
    });
    this.memberFormDirective.resetForm();
  }

  openSnackBar(message, action) {
    this.snackBar.open(message, action, {
        duration: 4000,
        horizontalPosition: 'left'
    });
  }

}
