import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ScrollingModule, ScrollDispatchModule } from '@angular/cdk/scrolling';

import { ZoneComponent } from './zone.component';
import { ZoneService } from 'src/app/core/services/zone.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-nav-bar',
  template: '<div></div>',
})
class FakeNavBarComponent {

  public mapCollapsed = true;
  public accCollapsed = true;

  constructor() { }

}

describe('ZoneComponent', () => {
  let component: ZoneComponent;
  let fixture: ComponentFixture<ZoneComponent>;

  let mockZoneService: any;
  let mockToastrService: any;
  let mockModalService: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        ScrollingModule,
        ScrollDispatchModule
      ],
      declarations: [
        ZoneComponent,
        FakeNavBarComponent
      ],
      providers: [
        { provide: ZoneService, useValue: mockZoneService },
        { provide: ToastrService, useValue: mockToastrService },
        { provide: NgbModal, useValue: mockModalService }
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoneComponent);
    component = fixture.componentInstance;
    //fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
