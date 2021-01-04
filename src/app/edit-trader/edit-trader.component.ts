import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Member } from '../shared/member';
import { FirebaseService } from '../services/firebase.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';


@Component({
  selector: 'app-edit-trader',
  templateUrl: './edit-trader.component.html',
  styleUrls: ['./edit-trader.component.scss']
})
export class EditTraderComponent implements OnInit {

  memberForm: FormGroup;
  member: Member;

  item: any;
  id: any;

  files: File[] = [];
  file: File;

  task: AngularFireUploadTask;
  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: string = null;

  @ViewChild('fform') memberFormDirective;

  formErrors = {
    'TC': '',
    'passport': '',
    'council_Id': '',
    'companyNameAR': '',
    'companyNameTR': '',
    'companyAddressAR': '',
    'companyAddressTR': '',
    'companyWorkAR': '',
    'companyWorkTR': '',
    'TCplaceAR': '',
    'TCplaceTR': '',
    'passport_placeAR': '',
    'passport_placeTR': '',
    'council_placeAR': '',
    'council_placeTR': '',
    'currentAdressAR': '',
    'currentAdressTR': '',
    'company_fundAR': '',
    'company_fundTR': '',
    'companyOriginAR': '',
    'companyOriginTR': '',
    'company_managerNameAR': '',
    'company_managerNameTR': '',
  };

  validationMessages = {
    'TC': {
      'required': 'TC Numarası zorunlu',
      'pattern': 'TC Numarası sadece rakamlardan oluşmalıdır',
      'minlength': 'TC Numarası 11 hane olmalıdır',
      'maxlength': 'Maksimum TC sayısı 11 hanedir'
    },
    'passport': {
      'required': 'code is required.',
    },
    'council_Id': {
      'required': 'MECLİS kimlik Numarası zorunlu',
      'pattern': 'MECLİS kimlik Numarası sadece rakamlardan oluşmalıdır',
      'minlength': 'MECLİS kimlik Numarası 11 hane olmalıdır',
      'maxlength': 'Maksimum MECLİS kimlik sayısı 11 hanedir'
    },
    'companyNameAR': {
      'required': 'code is required.',
    },
    'companyNameTR': {
      'required': 'code is required.',
    },
    'companyAddressAR': {
      'required': 'code is required.',
    },
    'companyAddressTR': {
      'required': 'code is required.',
    },
    'companyWorkAR': {
      'required': 'code is required.',
    },
    'companyWorkTR': {
      'required': 'code is required.',
    },
    'TCplaceAR': {
      'required': 'code is required.',
    },
    'TCplaceTR': {
      'required': 'code is required.',
    },
    'passport_placeAR': {
      'required': 'code is required.',
    },
    'passport_placeTR': {
      'required': 'code is required.',
    },
    'council_placeAR': {
      'required': 'code is required.',
    },
    'council_placeTR': {
      'required': 'code is required.',
    },
    'currentAdressAR': {
      'required': 'code is required.',
    },
    'currentAdressTR': {
      'required': 'code is required.',
    },
    'company_fundAR': {
      'required': 'code is required.',
    },
    'company_fundTR': {
      'required': 'code is required.',
    },
    'companyOriginAR': {
      'required': 'code is required.',
    },
    'companyOriginTR': {
      'required': 'code is required.',
    },
    'company_managerNameAR': {
      'required': 'code is required.',
    },
    'company_managerNameTR': {
      'required': 'code is required.',
    },
  };

  constructor(    
    public authService: AuthService,
    private fb: FormBuilder,
    private firebaseService: FirebaseService,
    public snackBar: MatSnackBar,
    public router: Router,
    private storage: AngularFireStorage,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.createForm();

    this.route.data.subscribe(routeData => {
      let data = routeData['data'];
      if (data) {
        this.item = data.payload.data();
        this.id = data.payload.id;
      }
    })
  }

  onDrop(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      this.files.push(files.item(i));
      this.file = this.files[i];
      this.startUpload(this.file);
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
        this.downloadURL = await ref.getDownloadURL().toPromise();
        this.files = [];
      }),
    );
  }

  createForm() {
    this.memberForm = this.fb.group({
      TC: [null, [Validators.required, Validators.pattern, Validators.minLength(11), Validators.maxLength(11)]],
      passport: ['', [Validators.required]],
      council_Id: [null, [Validators.required, Validators.pattern, Validators.minLength(11), Validators.maxLength(11)]],
      companyNameAR: ['', [Validators.required]],
      companyNameTR: ['', [Validators.required]],
      companyAddressAR: ['', [Validators.required]],
      companyAddressTR: ['', [Validators.required]],
      companyWorkAR: ['', [Validators.required]],
      companyWorkTR: ['', [Validators.required]],
      TCplaceAR: ['', [Validators.required]],
      TCplaceTR: ['', [Validators.required]],
      passport_placeAR: ['', [Validators.required]],
      passport_placeTR: ['', [Validators.required]],
      council_placeAR: ['', [Validators.required]],
      council_placeTR: ['', [Validators.required]],
      currentAdressAR: ['', [Validators.required]],
      currentAdressTR: ['', [Validators.required]],
      company_fundAR: ['', [Validators.required]],
      company_fundTR: ['', [Validators.required]],
      companyOriginAR: ['', [Validators.required]],
      companyOriginTR: ['', [Validators.required]],
      company_managerNameAR: ['', [Validators.required]],
      company_managerNameTR: ['', [Validators.required]],
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
      ...this.item,
      ...this.memberForm.value,
      certificate: this.downloadURL,
    };
    this.member = formData;
    this.firebaseService.updateMember('members', this.id, this.member)
    .then(
      res => {
        this.openSnackBar('Üye ' + this.member.nameTR + " Başarıyla eklendi...", '🙂')
        setTimeout(() => { this.router.navigate(['/members']); }, 3000);
      }
    )
    this.memberForm.reset({
      TC: '',
      passport: '',
      council_Id: '',
      companyNameAR: '',
      companyNameTR: '',
      companyAddressAR: '',
      companyAddressTR: '',
      companyWorkAR: '',
      companyWorkTR: '',
      TCplaceAR: '',
      TCplaceTR: '',
      passport_placeAR: '',
      passport_placeTR: '',
      council_placeAR: '',
      council_placeTR: '',
      currentAdressAR: '',
      currentAdressTR: '',
      company_fundAR: '',
      company_fundTR: '',
      companyOriginAR: '',
      companyOriginTR: '',
      company_managerNameAR: '',
      company_managerNameTR: '',
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
