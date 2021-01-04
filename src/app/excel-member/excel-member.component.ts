import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FirebaseService } from '../services/firebase.service';
import { Member } from '../shared/member';
import * as XLSX from 'xlsx'; 
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-excel-member',
  templateUrl: './excel-member.component.html',
  styleUrls: ['./excel-member.component.scss']
})
export class ExcelMemberComponent implements OnInit {

  results: any;
  members: Member[] = [];

  active: Member[] = [];
  notActive: Member[] = [];
  activeIn_30: Member[] = [];

  spinner: boolean = true;
  date : Date = new Date();
  setting: string = 'active';


  firstload: boolean = true;
  searchForm: FormGroup;
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
    ) { }

  ngOnInit(): void {
    this.createForm();
    this.getSome_members()
    // this.firebaseService.get_members('members')
    // .subscribe(result => {
    //   this.results = result;
    //   for(let i = 0; i < this.results.length; i++) {
    //     this.members[i] = this.results[i].payload.doc.data();
    //     if(this.results[i].payload.doc.data().end_PermitDate == null || this.results[i].payload.doc.data().fees == 'No_fee') {
    //       this.notActive.push(this.results[i].payload.doc.data());
    //     }
    //     else {
    //       if(this.calculateDiff(this.results[i].payload.doc.data().end_PermitDate) == 'Active') {
    //         this.active.push(this.results[i].payload.doc.data());
    //       }
    //       else if(this.calculateDiff(this.results[i].payload.doc.data().end_PermitDate) == 'inactive') {
    //         this.notActive.push(this.results[i].payload.doc.data());
    //       }
    //       else if (this.calculateDiff(this.results[i].payload.doc.data().end_PermitDate) == '30_days') {
    //         this.activeIn_30.push(this.results[i].payload.doc.data());
    //       }
    //     }
    //   }
    //   this.spinner = false;
    // })
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

  getSome_members() {
    this.active = [];
    this.notActive = [];
    this.activeIn_30 = [];
    var first = this.db.firestore.collection("members").limit(20);
    first.get().then((documentSnapshots: any) => {
      this.lastDocument = documentSnapshots.docs[documentSnapshots.docs.length-1];
      for(var i in documentSnapshots.docs) {
        this.members[i] = documentSnapshots.docs[i].data();
        this.members[i]._id = documentSnapshots.docs[i].id;
        if(this.members[i].end_PermitDate == null || this.members[i].fees == 'No_fee') {
          this.notActive.push(this.members[i]);
        }
        else {
          if(this.calculateDiff(this.members[i].end_PermitDate) == 'Active') {
            this.active.push(this.members[i]);
          }
          else if(this.calculateDiff(this.members[i].end_PermitDate) == 'inactive') {
            this.notActive.push(this.members[i]);
          }
          else if (this.calculateDiff(this.members[i].end_PermitDate) == '30_days') {
            this.activeIn_30.push(this.members[i]);
          }
        }
      }
      this.spinner = false;
      this.searchDone = false;
      this.firstload = true;
      this.wrongSearch = false;
    });
  }

  getAllMembers() {
    this.spinner = true;
    this.firstload = false;
    var last = this.db.firestore.collection("members").startAfter(this.lastDocument);
    last.get().then((documentSnapshots: any) => {
      const memberLength = this.members.length + documentSnapshots.docs.length;
      var j = 0;
      for(let i = this.members.length; i < memberLength; i++) {
        this.members[i] = documentSnapshots.docs[j].data();
        this.members[i]._id = documentSnapshots.docs[j].id;

        if(this.members[i].end_PermitDate == null || this.members[i].fees == 'No_fee') {
          this.notActive.push(this.members[i]);
        }
        else {
          if(this.calculateDiff(this.members[i].end_PermitDate) == 'Active') {
            this.active.push(this.members[i]);
          }
          else if(this.calculateDiff(this.members[i].end_PermitDate) == 'inactive') {
            this.notActive.push(this.members[i]);
          }
          else if (this.calculateDiff(this.members[i].end_PermitDate) == '30_days') {
            this.activeIn_30.push(this.members[i]);
          }
        }
        j++;
      }
      this.spinner = false;
    });
  }

  getFilteredMembers(value) {

    var strSearch = value.searchValue;
    var strlength = strSearch.length;
    var strFrontCode = strSearch.slice(0, strlength-1);
    var strEndCode = strSearch.slice(strlength-1, strSearch.length);
    var startcode = strSearch;
    var endcode= strFrontCode + String.fromCharCode(strEndCode.charCodeAt(0) + 1);

    this.active = [];
    this.notActive = [];
    this.activeIn_30 = [];
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

          if(this.members[i].end_PermitDate == null || this.members[i].fees == 'No_fee') {
            this.notActive.push(this.members[i]);
          }
          else {
            if(this.calculateDiff(this.members[i].end_PermitDate) == 'Active') {
              this.active.push(this.members[i]);
            }
            else if(this.calculateDiff(this.members[i].end_PermitDate) == 'inactive') {
              this.notActive.push(this.members[i]);
            }
            else if (this.calculateDiff(this.members[i].end_PermitDate) == '30_days') {
              this.activeIn_30.push(this.members[i]);
            }
          }
          
        }
        this.searchDone = true;
        this.wrongSearch = false;
      }
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
  }

  onSubmit() {
    const formData = {
      searchType: this.searchForm.value.searchType,
      searchValue: this.searchForm.value.searchValue,
    };
    this.getFilteredMembers(formData)
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

  activeExcel(): void {
     /* table id is passed over here */   
     let element = document.getElementById('active-table'); 
     const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

     /* generate workbook and add the worksheet */
     const wb: XLSX.WorkBook = XLSX.utils.book_new();
     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

     /* save to file */
     XLSX.writeFile(wb, 'aktif_üyeler.xlsx');
  }

  inactiveExcel(): void {
    /* table id is passed over here */   
    let element = document.getElementById('inactive-table'); 
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'aktif_olmayan_üyeler.xlsx');
  }

  activeIn30Excel(): void {
    /* table id is passed over here */   
    let element = document.getElementById('activeIn30-table'); 
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, '30_gün_içinde_aktif_üyeler.xlsx');
  }

  setMembers(set) {
    this.setting = set;
  }

}
