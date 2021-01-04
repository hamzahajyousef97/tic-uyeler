import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { DOCUMENT } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Member } from '../shared/member';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent implements OnInit {

  results: Array<any>;
  searchForm: FormGroup;
  passcode;
  searchText;
  members: Member[] = [];
  spinner: boolean = true;
  password: string = '001002003';
  showTable: boolean = true;

  firstload: boolean = true;
  secondload: boolean = false;

  searchDone: boolean = false;
  wrongSearch: boolean = false;
  lastDocument: any;

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
    private fb: FormBuilder,
    @Inject(DOCUMENT) private _document: Document) { }

  ngOnInit(): void {
    this.showTable = true;
    this.createForm();
    this.getSome_members()
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
    this.members = [];
    var first = this.db.firestore.collection("members").limit(15);
    first.get().then((documentSnapshots: any) => {
      this.lastDocument = documentSnapshots.docs[documentSnapshots.docs.length-1];
      for(var i in documentSnapshots.docs) {
        this.members[i] = documentSnapshots.docs[i].data();
        this.members[i]._id = documentSnapshots.docs[i].id;
      }
      this.spinner = false;
      this.searchDone = false;
      this.firstload = true;
      this.wrongSearch = false;
    });
  }

  getExtra_members() {
    this.spinner = true;
    var last = this.db.firestore.collection("members").startAfter(this.lastDocument).limit(40);
    last.get().then((documentSnapshots: any) => {
      this.lastDocument = documentSnapshots.docs[documentSnapshots.docs.length-1];
      this.firstload = false;
      const memberLength = this.members.length + documentSnapshots.docs.length;
      console.log(memberLength)
      var j = 0;
      for(let i = this.members.length; i < memberLength; i++) {
        this.members[i] = documentSnapshots.docs[j].data();
        this.members[i]._id = documentSnapshots.docs[j].id;
        j++;
      }
      this.spinner = false;
      this.secondload = true;
    });
  }

  getAllMembers() {
    this.spinner = true;
    this.secondload = false;
    var last = this.db.firestore.collection("members").startAfter(this.lastDocument);
    last.get().then((documentSnapshots: any) => {
      const memberLength = this.members.length + documentSnapshots.docs.length;
      var j = 0;
      for(let i = this.members.length; i < memberLength; i++) {
        this.members[i] = documentSnapshots.docs[j].data();
        this.members[i]._id = documentSnapshots.docs[j].id;
        j++;
      }
      this.spinner = false;
    });
  }

  onSubmit() {
    const formData = {
      searchType: this.searchForm.value.searchType,
      searchValue: this.searchForm.value.searchValue,
    };
    this.getFilteredMembers(formData)
  }

  refreshPage() {
    this._document.defaultView.location.reload();
  }

  deleteMember(id) {
    this.showTable = false;
    this.firebaseService.deleteMember('members', id)
    .then(
      res => {
        this.refreshPage();
      },
      err => {
        console.log(err);
      }
    )
  }

  calculateDiff(dateSent){
    let currentDate = new Date();
    dateSent = new Date(dateSent);
    if (Math.floor((Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate()) - Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) ) /(1000 * 60 * 60 * 24)) < 0) {
      return 'inactive';
    }
    else if (Math.floor((Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate()) - Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) ) /(1000 * 60 * 60 * 24)) < 30) {
      return '30_days';
    }
    else if (Math.floor((Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate()) - Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) ) /(1000 * 60 * 60 * 24)) >= 30) {
      return 'Active';
    }
    else {
      return 'inactive';
    }
  }
}
