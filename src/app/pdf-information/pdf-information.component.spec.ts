import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfInformationComponent } from './pdf-information.component';

describe('PdfInformationComponent', () => {
  let component: PdfInformationComponent;
  let fixture: ComponentFixture<PdfInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdfInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
