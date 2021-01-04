import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, ActivatedRoute } from "@angular/router";
import { FirebaseService } from '../services/firebase.service';

@Injectable()
export class MemberResolver implements Resolve<any> {

  constructor(public firebaseService: FirebaseService) { }

  resolve(route: ActivatedRouteSnapshot,) {

    return new Promise((resolve, reject) => {
      let memberId = route.paramMap.get('id');
      this.firebaseService.get_member('members', memberId)
      .subscribe(
        data => {
          resolve(data);
        }
      );
    })
  }
}
