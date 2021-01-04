import { Component, OnInit, ViewChild } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Member } from '../shared/member';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss']
})
export class SecurityComponent implements OnInit {

  results: any;
  searchText;
  members: Member[] = [];

  noResult: boolean = true;
  searchForm: FormGroup;
  searchDone: boolean = false;
  wrongSearch: boolean = false;

  @ViewChild('fform') searchFormDirective;

  formErrors = {
    'name': '',
    'phone': ''
  };

  
  validationMessages = {
    'name': {
      'required': 'الاسم مطلوب',
    },
    'phone': {
      'required': 'رقم الهاتف مطلوب',
      'pattern': 'يجب ان يحتوي رقم الهاتف على أرقام فقط'
    }
  };


  constructor(
    public authService: AuthService,
    public firebaseService: FirebaseService,
    public db: AngularFirestore,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.searchForm = this.fb.group({
      searchType: [null, [Validators.required]],
      searchValue: ['', [Validators.required]],
    });

    this.searchForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); //(re)set form validation messages 
  }

  onValueChanged(data?: any) {
    if (!this.searchForm) {
      return;
    }
    const form = this.searchForm;
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

  getFilteredMembers(value) {

    var strSearch = value.searchValue;
    var strlength = strSearch.length;
    var strFrontCode = strSearch.slice(0, strlength-1);
    var strEndCode = strSearch.slice(strlength-1, strSearch.length);
    var startcode = strSearch;
    var endcode= strFrontCode + String.fromCharCode(strEndCode.charCodeAt(0) + 1);

    this.members = [];
    this.noResult = false;
    this.db.firestore.collection("members")
    .where(value.searchType, '>=', startcode)
    .where(value.searchType, '<', endcode).get()
    .then((querySnapshot: any) => {
      if(querySnapshot.docs.length == 0) {
        this.wrongSearch = true;
        this.searchDone = true;
        console.log(this.wrongSearch)
      }
      else {
        for(var i in querySnapshot.docs) {
          this.members[i] = querySnapshot.docs[i].data();
          this.members[i]._id = querySnapshot.docs[i].id;
        }
        this.searchDone = true;
        this.wrongSearch = false;
      }
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
  }

  getSome_members() {
    this.noResult = true;
    this.searchDone = false;
    this.members = [];
  }

  onSubmit() {
    const formData = {
      searchType: this.searchForm.value.searchType,
      searchValue: this.searchForm.value.searchValue,
    };
    this.getFilteredMembers(formData)
  }


}
