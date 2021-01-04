import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AuthGuard } from './guard/auth.guard';
import { SecureInnerPagesGuard } from './guard/secure-inner-pages.guard';

import { HomeComponent } from './home/home.component';
import { MembersComponent } from './members/members.component';
import { TradersComponent } from './traders/traders.component';
import { InformationComponent } from './information/information.component';
import { SecurityComponent } from './security/security.component';

import { EditInformationComponent } from './edit-information/edit-information.component';
import { EditTraderComponent } from './edit-trader/edit-trader.component';
import { EditMemberComponent } from './edit-member/edit-member.component';
import { EditSecurityComponent } from './edit-security/edit-security.component';
import { AddChildrenComponent } from './add-children/add-children.component';
import { AddBrotherComponent } from './add-brother/add-brother.component';

import { PdfInformationComponent } from './pdf-information/pdf-information.component';
import { PdfSecurityComponent } from './pdf-security/pdf-security.component';

import { ReceiptComponent } from './receipt/receipt.component';
import { ExcelMemberComponent } from './excel-member/excel-member.component';

import { MemberResolver } from './resolver/member.resolver';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'sign-in', component: SignInComponent },
  // { path: 'register-user', component: SignUpComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'members', component: MembersComponent, canActivate: [AuthGuard] },
  { path: 'traders', component: TradersComponent, canActivate: [AuthGuard] },

  { path: 'add-children/:id', component: AddChildrenComponent,resolve:{ data : MemberResolver }, canActivate: [AuthGuard] },
  { path: 'add-brothers/:id', component: AddBrotherComponent,resolve:{ data : MemberResolver }, canActivate: [AuthGuard] },

  { path: 'edit-member/:id', component: EditMemberComponent, resolve:{ data : MemberResolver }, canActivate: [AuthGuard] },
  { path: 'edit-information/:id', component: EditInformationComponent, resolve:{ data : MemberResolver }, canActivate: [AuthGuard] },
  { path: 'edit-trader/:id', component: EditTraderComponent, resolve:{ data : MemberResolver }, canActivate: [AuthGuard] },
  { path: 'edit-security/:id', component: EditSecurityComponent, resolve:{ data : MemberResolver }, canActivate: [AuthGuard] },

  { path: 'information/:id', component: PdfInformationComponent, resolve:{ data : MemberResolver }, canActivate: [AuthGuard],  },
  { path: 'security/:id', component: PdfSecurityComponent, resolve:{ data : MemberResolver }, canActivate: [AuthGuard] },
  { path: 'receipt/:id', component: ReceiptComponent, resolve:{ data : MemberResolver }, canActivate: [AuthGuard]  },

  { path: 'excel', component: ExcelMemberComponent, canActivate: [AuthGuard]  },

  { path: 'information', component: InformationComponent, canActivate: [AuthGuard] },
  { path: 'security', component: SecurityComponent, canActivate: [AuthGuard] },
  { path: '**',  component: HomeComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
