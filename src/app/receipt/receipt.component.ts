import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FirebaseService } from '../services/firebase.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Globals } from '../global';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss']
})
export class ReceiptComponent implements OnInit {

  item: any;
  id: any;

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
        console.log(this.item)
      }
    })
  }

  generatePdf() {
    window.print();
  }

}
