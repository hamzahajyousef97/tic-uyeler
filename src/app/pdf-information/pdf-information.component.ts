import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FirebaseService } from '../services/firebase.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Globals } from '../global';
 
@Component({
  selector: 'app-pdf-information',
  templateUrl: './pdf-information.component.html',
  styleUrls: ['./pdf-information.component.scss']
})
export class PdfInformationComponent implements OnInit {

  item: any;
  id: any;

  brothers: Array<any>;
  children: Array<any>;

  numberChildren: number;


  constructor(    
    public authService: AuthService,
    private firebaseService: FirebaseService,
    public snackBar: MatSnackBar,
    public router: Router,
    private route: ActivatedRoute,
    public globals: Globals
    ) { }
    

  ngOnInit(): void {
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
      this.numberChildren = this.children.length;
    })
  }
   generatePdf() {
    window.print();
  }

}
