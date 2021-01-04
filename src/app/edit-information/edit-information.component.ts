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
  selector: 'app-edit-information',
  templateUrl: './edit-information.component.html',
  styleUrls: ['./edit-information.component.scss']
})
export class EditInformationComponent implements OnInit {

  infoForm: FormGroup;
  member: Member;

  item: any;
  id: any;

  brothers: Array<any>;
  children: Array<any>;

  @ViewChild('fform') memberFormDirective;

  formErrors = {
    'ethnicAR': '',
    'ethnicTR': '',
    'religion': '',
    'clanAR': '',
    'clanTR': '',
    'criminalRecordAR': '',
    'criminalRecordTR': '',
    'revolution': '',
    'terrorismAR': '',
    'terrorismTR': '',
    'family_terrorismAR': '',
    'family_terrorismTR': '',
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

    this.firebaseService.getBrothers('members', this.id)
    .subscribe(result => {
      this.brothers = result;
    })

    this.firebaseService.getChildrens('members', this.id)
    .subscribe(result => {
      this.children = result;
    })
  }

  createForm() {
    this.infoForm = this.fb.group({
      ethnicAR: ['', [Validators.required]],
      ethnicTR: ['', [Validators.required]],
      religion: ['', [Validators.required]],
      clanAR: ['', [Validators.required]],
      clanTR: ['', [Validators.required]],
      criminalRecordAR: ['', [Validators.required]],
      criminalRecordTR: ['', [Validators.required]],
      revolution: false,
      terrorismAR: ['', [Validators.required]],
      terrorismTR: ['', [Validators.required]],
      family_terrorismAR: ['', [Validators.required]],
      family_terrorismTR: ['', [Validators.required]],
    });
    this.infoForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); //(re)set form validation messages 
  }

  onValueChanged(data?: any) {
    if (!this.infoForm) {
      return;
    }
    const form = this.infoForm;
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
      ...this.infoForm.value,

    };
    this.member = formData;
    this.firebaseService.updateMember('members', this.id, this.member)
    .then(
      res => {
        this.openSnackBar('Üye ' + this.member.nameTR + " Başarıyla eklendi...", '🙂')
        setTimeout(() => { this.router.navigate(['/members']); }, 3000);
      }
    )
    this.infoForm.reset({
      ethnicAR: '',
      ethnicTR: '',
      religion: '',
      clanAR: '',
      clanTR: '',
      criminalRecordAR: '',
      criminalRecordTR: '',
      revolution: false,
      terrorismAR: '',
      terrorismTR: '',
      family_terrorismAR: '',
      family_terrorismTR: '',
    });
    this.memberFormDirective.resetForm();
  }

  delete_brother(brotherId) {
    this.firebaseService.deleteBrother('members', this.id, brotherId)
    .then(
      res => {
      },
      err => {
        console.log(err);
      }
    )
  }

  delete_children(childId) {
    this.firebaseService.deleteChildren('members', this.id, childId)
    .then(
      res => {
      },
      err => {
        console.log(err);
      }
    )
  }

  openSnackBar(message, action) {
    this.snackBar.open(message, action, {
        duration: 4000,
        horizontalPosition: 'left'
    });
  }

}
