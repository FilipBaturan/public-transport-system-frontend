import { TestBed, fakeAsync } from '@angular/core/testing';

import { NewsService } from './news.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrService } from 'ngx-toastr';
import { NewsToAdd } from 'src/app/model/news.model';

describe('NewsService', () => {

    let mockToastrService: any;
    let mockHttp: HttpTestingController;
    let service: NewsService;

    const url = '/api/news';
    const news: NewsToAdd = { title: 'null', content: 'null', operator: 1 };

    beforeEach(() => {

        mockToastrService = jasmine.createSpyObj(['success', 'error']);

        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [
                { provide: ToastrService, useValue: mockToastrService }
            ]
        });

        mockHttp = TestBed.get(HttpTestingController);
        service = TestBed.get(NewsService);
    });

    afterEach(() => {
        mockHttp.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
