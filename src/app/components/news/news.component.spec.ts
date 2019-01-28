import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';

import { NewsComponent } from './news.component';
import { of, asyncScheduler } from 'rxjs';
import { VehicleService } from 'src/app/core/services/vehicle.service';
import { News } from 'src/app/model/news.model';
import { NewsService } from 'src/app/core/services/news.service';

describe('NewsComponent', () => {
  let component: NewsComponent;
  let fixture: ComponentFixture<NewsComponent>;

  let mockNewsService: any;

  let dbNews: News[];

  beforeEach(async(() => {

    dbNews = [
      {id: 1, title: 'null', content: 'null', operator: 1, date: new Date(), active: true},
      {id: 2, title: 'none', content: 'none', operator: 2, date: new Date(), active: true}
    ];

    mockNewsService = {
      findAll() {
        return of(dbNews, asyncScheduler);
      }
    };

    spyOn(mockNewsService, 'findAll').and.callThrough();

    TestBed.configureTestingModule({
      declarations: [ NewsComponent ],
      providers: [
        { provide: NewsService, useValue: mockNewsService }
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsComponent);
    component = fixture.componentInstance;
  });

  it('should create', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.allNews.length).toBe(dbNews.length);
  }));
});
