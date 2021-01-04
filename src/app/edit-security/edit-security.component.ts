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
  selector: 'app-edit-security',
  templateUrl: './edit-security.component.html',
  styleUrls: ['./edit-security.component.scss']
})
export class EditSecurityComponent implements OnInit {

  memberForm: FormGroup;
  member: Member;

  item: any;
  id: any;

  @ViewChild('fform') memberFormDirective;

  formErrors = {
    'start_PermitDate': '',
    'end_PermitDate': '',
    'currentWorkAR': '',
    'currentWorkTR': '',
    'currentWork_addresAR': '',
    'currentWork_addresTR': '',
    'laterWorkAR': '',
    'laterWorkTR': '',
    'laterWork_addresAR': '',
    'laterWork_addresTR': '',
    'wifeWorkAR': '',
    'wifeWorkTR': '',
    'fees': '',
    'total_payment': '',
    'paid': '',
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

  createForm() {
    this.memberForm = this.fb.group({
      start_PermitDate: ['', [Validators.required]],
      end_PermitDate: ['', [Validators.required]],
      currentWorkAR: ['', [Validators.required]],
      currentWorkTR: ['', [Validators.required]],
      currentWork_addresAR: ['', [Validators.required]],
      currentWork_addresTR: ['', [Validators.required]],
      laterWorkAR: ['', [Validators.required]],
      laterWorkTR: ['', [Validators.required]],
      laterWork_addresAR: ['', [Validators.required]],
      laterWork_addresTR: ['', [Validators.required]],
      wifeWorkAR: ['', [Validators.required]],
      wifeWorkTR: ['', [Validators.required]],
      fees: ['', [Validators.required]],
      total_payment: ['', [Validators.required]],
      paid: ['', [Validators.required]],
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
      start_PermitDate: '',
      end_PermitDate: '',
      currentWorkAR: '',
      currentWorkTR: '',
      currentWork_addresAR: '',
      currentWork_addresTR: '',
      laterWorkAR: '',
      laterWorkTR: '',
      laterWork_addresAR: '',
      laterWork_addresTR: '',
      wifeWorkAR: '',
      wifeWorkTR: '',
      fees: '',
      total_payment: '',
      paid: '',
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
