import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Brother } from '../shared/brother';
import { FirebaseService } from '../services/firebase.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';


@Component({
  selector: 'app-add-brother',
  templateUrl: './add-brother.component.html',
  styleUrls: ['./add-brother.component.scss']
})
export class AddBrotherComponent implements OnInit {

  brotherForm: FormGroup;
  brother: Brother;

  item: any;
  id: any;

  @ViewChild('fform') brotherFormDirective;

  formErrors = {
    'seriNo': '',
    'dateBirth': '',
    'sex': '',
    'nameAR': '',
    'nameTR': '',
    'placeBirthAR': '',
    'placeBirthTR': '',
    'addressAR': '',
    'addressTR': '',
    'workAR': '',
    'workTR': '',
    'marriedAR': '',
    'marriedTR': '',
  };

  validationMessages = {

  };


  constructor(
    public authService: AuthService,
    private fb: FormBuilder,
    private firebaseService: FirebaseService,
    public snackBar: MatSnackBar,
    public router: Router,
    private storage: AngularFireStorage,
    private route: ActivatedRoute
  ) { }

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

  createForm() {
    this.brotherForm = this.fb.group({
      seriNo: ['', [Validators.required]],
      dateBirth: ['', [Validators.required]],
      sex: ['', [Validators.required]],
      nameAR: ['', [Validators.required]],
      nameTR: ['', [Validators.required]],
      placeBirthAR: ['', [Validators.required]],
      placeBirthTR: ['', [Validators.required]],
      addressAR: ['', [Validators.required]],
      addressTR: ['', [Validators.required]],
      workAR: ['', [Validators.required]],
      workTR: ['', [Validators.required]],
      marriedAR: ['', [Validators.required]],
      marriedTR: ['', [Validators.required]],
    });

    this.brotherForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); //(re)set form validation messages 
  }

  onValueChanged(data?: any) {
    if (!this.brotherForm) {
      return;
    }
    const form = this.brotherForm;
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
      ...this.brotherForm.value,
    };
    this.brother = formData;
    this.firebaseService.addBrothers('members', this.id, this.brother)
    .then(
      res => {
        this.openSnackBar('Üye ' + this.brother.nameTR + " Başarıyla eklendi...", '🙂')
        setTimeout(() => { this.router.navigate(['/edit-information/' + this.id]); }, 2000);
      }
    )
    this.brotherForm.reset({
      seriNo: '',
      dateBirth: '',
      sex: '',
      nameAR: '',
      nameTR: '',
      placeBirthAR: '',
      placeBirthTR: '',
      addressAR: '',
      addressTR: '',
      workAR: '',
      workTR: '',
      marriedAR: '',
      marriedTR: '',
    });
    this.brotherFormDirective.resetForm();
  }

  openSnackBar(message, action) {
    this.snackBar.open(message, action, {
        duration: 4000,
        horizontalPosition: 'left'
    });
  }
}
