// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { Component } from '@angular/core';
// import { FormsModule } from '@angular/forms';

// import { ScheduleComponent } from './schedule.component';
// import { ScheduleService } from 'src/app/core/services/schedule.service';
// import { TransportLineService } from 'src/app/core/services/transport-line.service';


// @Component({
//   selector: 'app-nav-bar',
//   template: '<div></div>',
// })
// class FakeNavBarComponent {

//   public mapCollapsed = true;
//   public accCollapsed = true;

//   constructor() { }

// }

// describe('ScheduleComponent', () => {
//   let component: ScheduleComponent;
//   let fixture: ComponentFixture<ScheduleComponent>;

//   let mockScheduleService: any;
//   let mockTransportLineService: any;

//   beforeEach(async(() => {
//     mockScheduleService = jasmine.createSpyObj(['']);
//     mockTransportLineService = jasmine.createSpyObj(['']);

//     TestBed.configureTestingModule({
//       imports: [
//         FormsModule
//       ],
//       declarations: [
//         ScheduleComponent,
//         FakeNavBarComponent
//       ],
//       providers: [
//         { provide: ScheduleService, useValue: mockScheduleService },
//         { provide: TransportLineService, useValue: mockTransportLineService }
//       ]
//     });
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(ScheduleComponent);
//     component = fixture.componentInstance;
//     //fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
