import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(public db: AngularFirestore) { }

  get_member(collection, id){
    return this.db.collection(collection).doc(id).snapshotChanges();
  }

  get_members(collection){
    return this.db.collection(collection).snapshotChanges();
  }

  addMember(collection, value){
    return this.db.collection(collection).add({
      id: value.id,
      TC: value.TC,

      council_Id: value.council_Id,
      passport: value.passport,
      seriNo: value.seriNo,
      image: value.image,
      passportImage: value.passportImage,
      idImage: value.idImage,
      nameAR: value.nameAR,
      nameTR: value.nameTR,
      lastnameAR: value.lastnameAR,
      lastnameTR: value.lastnameTR,
      fatherAR: value.fatherAR,
      fatherTR: value.fatherTR,
      motherAR: value.motherAR,
      motherTR: value.motherTR,
      placeBirthAR: value.placeBirthAR,
      placeBirthTR: value.placeBirthTR,
      dateBirth: value.dateBirth,
      cityAR: value.cityAR,
      cityTR: value.cityTR,
      currentAdressAR: value.currentAdressAR,
      currentAdressTR: value.currentAdressTR,
      laterAdressAR: value.laterAdressAR,
      laterAdressTR: value.laterAdressTR,
      phone: value.phone,
      whatsApp: value.whatsApp,
      otherNationalityAR: value.otherNationalityAR,
      otherNationalityTR: value.otherNationalityTR,
      educationAR: value.educationAR,
      educationTR: value.educationTR,
      marriedAR: value.marriedAR,
      marriedTR: value.marriedTR,
      foundationWorkAR: value.foundationWorkAR,
      foundationWorkTR: value.foundationWorkTR,
      family_foundationWorkAR: value.family_foundationWorkAR,
      family_foundationWorkTR: value.family_foundationWorkTR,
      wife_Name_AR: value.wife_Name_AR,
      wife_Name_TR: value.wife_Name_TR,
      createdAt: value.createdAt,
      roomRecord: value.roomRecord,
      relative_roomRecord: value.relative_roomRecord,
      // numberChildren: value.numberChildren,

      // Information
      ethnicAR: null,
      ethnicTR: null,
      religion: null,
      clanAR: null,
      clanTR: null,
      criminalRecordAR: null,
      criminalRecordTR: null,
      revolution: null,
      terrorismAR: null,
      terrorismTR: null,
      family_terrorismAR: null,
      family_terrorismTR: null,

      //trader
      fees: null,
      total_payment: null,
      paid: null,
      wifeWorkAR: null,
      wifeWorkTR: null,
      start_PermitDate: null,
      end_PermitDate: null,
      currentWorkAR: null,
      currentWorkTR: null,
      currentWork_addresAR: null,
      currentWork_addresTR: null,
      laterWorkAR: null,
      laterWorkTR: null,
      laterWork_addresAR: null,
      laterWork_addresTR: null,
      certificate: null,

      // Company

      companyNameAR: null,
      companyNameTR: null,
      companyAddressAR: null,
      companyAddressTR: null,
      companyWorkAR: null,
      companyWorkTR: null,
      TCplaceAR: null,
      TCplaceTR: null,
      passport_placeAR: null,
      passport_placeTR: null,
      council_placeAR: null,
      council_placeTR: null,
      company_fundAR: null,
      company_fundTR: null,
      companyOriginAR: null,
      companyOriginTR: null,
      company_managerNameAR: null,
      company_managerNameTR: null,
    });
  }

  // EditInformation(collection, id, value){
  //   return this.db.doc(collection + '/' + id).set(value);
  // }

  // EditTrader(collection, id, value){
  //   return this.db.doc(collection + '/' + id).set(value);
  // }

  // EditComapny(collection, id, value){
  //   return this.db.doc(collection + '/' + id).set(value);
  // }

  updateMember(collection, id, value){
    return this.db.collection(collection).doc(id).set(value);
  }

  deleteMember(collection, name){
    return this.db.collection(collection).doc(name).delete();
  }

  addChildren(collection, id, value){
    return this.db.collection(collection).doc(id).collection('childrens').add({
      seriNo: value.seriNo,
      nameAR: value.nameAR,
      nameTR: value.nameTR,
      sex: value.sex,
      placeBirthAR: value.placeBirthAR,
      placeBirthTR: value.placeBirthTR,
      dateBirth: value.dateBirth,
      addressAR: value.addressAR,
      addressTR: value.addressTR,
      workAR: value.workAR,
      workTR: value.workTR,
      marriedAR: value.marriedAR,
      marriedTR: value.marriedTR,
    });
  }
  addBrothers(collection, id, value){
    return this.db.collection(collection).doc(id).collection('brothers').add({
      seriNo: value.seriNo,
      nameAR: value.nameAR,
      nameTR: value.nameTR,
      sex: value.sex,
      placeBirthAR: value.placeBirthAR,
      placeBirthTR: value.placeBirthTR,
      dateBirth: value.dateBirth,
      addressAR: value.addressAR,
      addressTR: value.addressTR,
      workAR: value.workAR,
      workTR: value.workTR,
      marriedAR: value.marriedAR,
      marriedTR: value.marriedTR,
    });
  }
  // addCompanies(collection, id, value){
  //   return this.db.collection(collection + '/' + id + '/companies').add({
  //     TC: value.TC,
  //     passport: value.passport,
  //     council_Id: value.council_Id,
  //     companyNameAR: value.companyNameAR,
  //     companyNameTR: value.companyNameTR,
  //     companyAddressAR: value.companyAddressAR,
  //     companyAddressTR: value.companyAddressTR,
  //     companyWorkAR: value.companyWorkAR,
  //     companyWorkTR: value.companyWorkTR,
  //     TCplaceAR: value.TCplaceAR,
  //     TCplaceTR: value.TCplaceTR,
  //     passport_placeAR: value.passport_placeAR,
  //     passport_placeTR: value.passport_placeTR,
  //     council_placeAR: value.council_placeAR,
  //     council_placeTR: value.council_placeTR,
  //     currentAdressAR: value.currentAdressAR,
  //     currentAdressTR: value.currentAdressTR,
  //     company_fundAR: value.company_fundAR,
  //     company_fundTR: value.company_fundTR,
  //     companyOriginAR: value.companyOriginAR,
  //     companyOriginTR: value.companyOriginTR,
  //     company_managerNameAR: value.company_managerNameAR,
  //     company_managerNameTR: value.company_managerNameTR,
  //   });
  // }

  getChildrens(collection, id){
    return this.db.collection(collection + '/' + id + '/childrens').snapshotChanges();
  }
  getBrothers(collection, id){
    return this.db.collection(collection + '/' + id + '/brothers').snapshotChanges();
  }
  getCompanies(collection, id){
    return this.db.collection(collection + '/' + id + '/companies').snapshotChanges();
  }

  updateChildren(collection, id, children_id, value){
    return this.db.doc(collection + '/' + id + '/childrens/' + children_id).set(value);
  }
  updateBrother(collection, id, brother_id, value){
    return this.db.doc(collection + '/' + id + '/brothers/' + brother_id).set(value);
  }
  // updateCompany(collection, id, company_id, value){
  //   // collection + '/' + id + '/companies/' + company_id
  //   return this.db.collection(collection).doc(id).collection('companies').doc(company_id).set(value);
  // }

  deleteChildren(collection, id, children_id){
    return this.db.doc(collection + '/' + id + '/childrens/' + children_id).delete();
  }
  deleteBrother(collection, id, brother_id){
    return this.db.doc(collection + '/' + id + '/brothers/' + brother_id).delete();
  }
  deleteCompany(collection, id, company_id){
    return this.db.doc(collection + '/' + id + '/companies/' + company_id).delete();
  }
}
