import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcelMemberComponent } from './excel-member.component';

describe('ExcelMemberComponent', () => {
  let component: ExcelMemberComponent;
  let fixture: ComponentFixture<ExcelMemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExcelMemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcelMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
