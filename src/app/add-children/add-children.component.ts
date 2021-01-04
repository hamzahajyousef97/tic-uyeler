import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Children } from '../shared/children';
import { FirebaseService } from '../services/firebase.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';



@Component({
  selector: 'app-add-children',
  templateUrl: './add-children.component.html',
  styleUrls: ['./add-children.component.scss']
})
export class AddChildrenComponent implements OnInit {

  childForm: FormGroup;
  children: Children;

  item: any;
  id: any;

  @ViewChild('fform') childFormDirective;

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
    this.childForm = this.fb.group({
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

    this.childForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); //(re)set form validation messages 
  }

  onValueChanged(data?: any) {
    if (!this.childForm) {
      return;
    }
    const form = this.childForm;
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
      ...this.childForm.value,
    };
    this.children = formData;
    this.firebaseService.addChildren('members', this.id, this.children)
    .then(
      res => {
        this.openSnackBar('Çocuk ' + this.children.nameTR + " Başarıyla eklendi...", '🙂')
        setTimeout(() => { this.router.navigate(['/edit-information/' + this.id]); }, 2000);
      }
    )
    this.childForm.reset({
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
    this.childFormDirective.resetForm();
  }

  openSnackBar(message, action) {
    this.snackBar.open(message, action, {
        duration: 4000,
        horizontalPosition: 'left'
    });
  }
}
