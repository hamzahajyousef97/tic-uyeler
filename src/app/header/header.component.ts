import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Globals } from '../global';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {


  role: string;
  loading: boolean = false; 

  constructor(public authService: AuthService,
    public globals: Globals) {
      this.role = globals.lang;
    }

  ngOnInit(): void {

  }

  public setLang(lang) {
    this.role = lang;
    this.globals.lang = this.role;
  }

}
