import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  loading = false;
  errMess: string;

  signInForm: FormGroup;

  @ViewChild('fform') quizFormDirective;

  formErrors = {
    'email': '',
    'password': '',
  };
  validationMessages = {
    'email': {
      'required': 'Email is required.',
      'email': 'Email not in valid format.'
    },
    'password': {
      'required': 'name is required.',
    }
  };

  constructor(
    public authService: AuthService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this.signInForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); //(re)set form validation messages 
  }

  onValueChanged(data?: any) {
    if (!this.signInForm) {
      return;
    }
    const form = this.signInForm;
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

  SignIn(email, password) {
    this.loading = true;
    this.authService.SignIn(email, password).then(
      res => {
        setTimeout(() => { 
          this.loading = false;
        }, 1500);
      },
      error => {
        this.loading = false;
        if (error.code == "auth/wrong-password") {
          this.errMess = 'Şifreniz hatalı.';
          console.log("Şifreniz hatalıdır.")
        }
        else if (error.code == "auth/too-many-requests") {
          this.errMess = 'Çok fazla başarısız giriş denemesi. Lütfen daha sonra tekrar deneyiniz.';
          console.log("Çok fazla başarısız giriş denemesi. Lütfen daha sonra tekrar deneyiniz.")
        }
        else if (error.code == "auth/user-not-found") {
          this.errMess = 'E-posta adresiniz hatalıdır.';
          console.log("E-posta adresiniz hatalıdır")
        }
        else {
          this.errMess = error.message;
        }
      })
  }

}
