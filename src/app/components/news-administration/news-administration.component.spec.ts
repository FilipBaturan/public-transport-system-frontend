import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsAdministrationComponent } from './news-administration.component';

describe('NewsAdministrationComponent', () => {
  let component: NewsAdministrationComponent;
  let fixture: ComponentFixture<NewsAdministrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsAdministrationComponent ]
    })
    .compileComponents();
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
