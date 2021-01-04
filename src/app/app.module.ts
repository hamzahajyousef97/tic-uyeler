import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import 'hammerjs';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';


import { DpDatePickerModule } from 'ng2-date-picker';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AuthService } from './services/auth.service';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { MembersComponent } from './members/members.component';
import { TradersComponent } from './traders/traders.component';
import { SecurityComponent } from './security/security.component';
import { InformationComponent } from './information/information.component';
import { EditInformationComponent } from './edit-information/edit-information.component';
import { EditTraderComponent } from './edit-trader/edit-trader.component';
import { FileSizePipe } from './pipes/file-size.pipe';
import { EditMemberComponent } from './edit-member/edit-member.component';
import { EditSecurityComponent } from './edit-security/edit-security.component';
import { Globals } from './global';
import { MemberResolver } from './resolver/member.resolver';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AddChildrenComponent } from './add-children/add-children.component';
import { AddBrotherComponent } from './add-brother/add-brother.component';
import { OnlyNumbersDirective } from './directives/only-numbers.directive';

import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { PdfInformationComponent } from './pdf-information/pdf-information.component';
import { PdfSecurityComponent } from './pdf-security/pdf-security.component';
import { ExcelMemberComponent } from './excel-member/excel-member.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';

import { WebcamModule } from 'ngx-webcam';
import { ReceiptComponent } from './receipt/receipt.component';



const config = {
  apiKey: "AIzaSyBGDyGtU6Wbz3QejvwOE8xCdXYjXIeXF_s",
  authDomain: "cobanbey-web.firebaseapp.com",
  databaseURL: "https://cobanbey-web.firebaseio.com",
  projectId: "cobanbey-web",
  storageBucket: "cobanbey-web.appspot.com",
  messagingSenderId: "1056407930124",
  appId: "1:1056407930124:web:32da9909c6149eac1df529",
  measurementId: "G-CCDLVCTZ2F"

  // apiKey: "AIzaSyD2oWrElXwINNTFHyJLy6cMMTASqCFr3gA",
  // authDomain: "test-database-f4547.firebaseapp.com",
  // databaseURL: "https://test-database-f4547.firebaseio.com",
  // projectId: "test-database-f4547",
  // storageBucket: "test-database-f4547.appspot.com",
  // messagingSenderId: "939434502560",
  // appId: "1:939434502560:web:3145291de9746b27db5cc5",
  // measurementId: "G-TVR89G6S3S"
};

const mat = [
  MatButtonModule,
  MatIconModule,
  MatMenuModule,
  MatSidenavModule,
  MatToolbarModule,
  MatListModule,
  MatGridListModule,
  MatCardModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatCheckboxModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatProgressSpinnerModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatSliderModule,
  MatSnackBarModule,
];


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    SignInComponent,
    SignUpComponent,
    MembersComponent,
    TradersComponent,
    SecurityComponent,
    InformationComponent,
    EditInformationComponent,
    EditTraderComponent,
    FileSizePipe,
    EditMemberComponent,
    EditSecurityComponent,
    AddChildrenComponent,
    AddBrotherComponent,
    OnlyNumbersDirective,
    PdfInformationComponent,
    PdfSecurityComponent,
    ExcelMemberComponent,
    ReceiptComponent,
  ],
  imports: [
    ...mat,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    WebcamModule,
    DpDatePickerModule,
    AppRoutingModule,
    MDBBootstrapModule.forRoot(),
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(config, 'test-database-f4547'),
    AngularFirestoreModule, // Only required for database features
    AngularFireAuthModule, // Only required for auth features,
    AngularFireStorageModule,
    Ng2SearchPipeModule,
  ],
  exports: [

  ],
  providers: [
    AuthService,
    MemberResolver,
    Globals,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
