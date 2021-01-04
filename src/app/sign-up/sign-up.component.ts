import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  loading = false;
  errMess: string;

  signUpForm: FormGroup;

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
    this.signUpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this.signUpForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); //(re)set form validation messages 
  }

  onValueChanged(data?: any) {
    if (!this.signUpForm) {
      return;
    }
    const form = this.signUpForm;
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
  SignUp(email, password) {
    this.loading = true;
    this.authService.SignUp(email, password).then(
      res => {
        setTimeout(() => { 
          this.loading = false;
        }, 1500);
      },
      error => {
        this.loading = false;
        console.log(error)
        if (error.code == "auth/email-already-in-use") {
          this.errMess = 'Belirttiğiniz E-posta adresi kullanılıyor';
          console.log("Belirttiğiniz E-posta adresi kullanılıyor")
        }
        else if (error.code == "auth/invalid-email") {
          this.errMess = 'E-posta adresi yanlış formatta';
          console.log("E-posta adresi yanlış formatında")
        }
        else if (error.code == "auth/weak-password") {
          this.errMess = 'Parola 6 karakter veya daha uzun olmalıdır.';
          console.log("Parola 6 karakter veya daha uzun olmalıdır.")
        }
        else {
          this.errMess = error.message;
        }
      }
    )
  }
}
