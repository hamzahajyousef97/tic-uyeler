import { Injectable } from '@angular/core';
import { Member } from './shared/member';

@Injectable()
export class Members {
    active: Member[];
    notActive: Member[];
    activeIn_5: Member[];
}