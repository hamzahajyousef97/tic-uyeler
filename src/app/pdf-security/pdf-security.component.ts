import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FirebaseService } from '../services/firebase.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Globals } from '../global';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import * as XLSX from 'xlsx'; 

@Component({
  selector: 'app-pdf-security',
  templateUrl: './pdf-security.component.html',
  styleUrls: ['./pdf-security.component.scss']
})
export class PdfSecurityComponent implements OnInit {

  item: any;
  id: any;
  children: Array<any>;

  role: string;
  loading: boolean = false; 

  numberChildren: number;
  fileName = 'ExcelSheet.xlsx'; 

  constructor(
    public authService: AuthService,
    private firebaseService: FirebaseService,
    public snackBar: MatSnackBar,
    public router: Router,
    private route: ActivatedRoute,
    public globals: Globals
  ) {
    this.role = globals.lang;
  }

  ngOnInit(): void {
    this.route.data.subscribe(routeData => {
      let data = routeData['data'];
      if (data) {
        this.item = data.payload.data();
        this.id = data.payload.id;
      }
    })

    this.firebaseService.getChildrens('members', this.id)
    .subscribe(result => {
      this.children = result;
      this.numberChildren = this.children.length;
    })
  }

  generatePdf() {
    window.print();
  }

  setLang(lang) {
    this.role = lang;
    this.globals.lang = this.role;
  }
  
  exportexcel(): void 
    {
       /* table id is passed over here */   
       let element = document.getElementById('excel-table'); 
       const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

       /* generate workbook and add the worksheet */
       const wb: XLSX.WorkBook = XLSX.utils.book_new();
       XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

       /* save to file */
       XLSX.writeFile(wb, this.fileName);
			
    }
}
