import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfSecurityComponent } from './pdf-security.component';

describe('PdfSecurityComponent', () => {
  let component: PdfSecurityComponent;
  let fixture: ComponentFixture<PdfSecurityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdfSecurityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
