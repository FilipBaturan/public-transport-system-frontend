import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import { NewsAdministrationComponent } from './news-administration.component';


@Component({
  selector: 'app-nav-bar',
  template: '<div></div>',
})
class FakeNavBarComponent {

  public mapCollapsed = true;
  public accCollapsed = true;

  constructor() { }

}

describe('NewsAdministrationComponent', () => {
  let component: NewsAdministrationComponent;
  let fixture: ComponentFixture<NewsAdministrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        NewsAdministrationComponent,
        FakeNavBarComponent
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsAdministrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
