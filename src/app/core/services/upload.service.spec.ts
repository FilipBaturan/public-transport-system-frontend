import { TestBed, fakeAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { UploadService } from './upload.service';
import { Image } from 'src/app/model/util.model';

describe('UploadService', () => {

  const url = '/api/image';
  let image: Image;
  let imagePath: string;
  let uploadData: FormData;

  let mockHttp: HttpTestingController;
  let service: UploadService;

  beforeEach(() => {
    image = {content: 'QAcUGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAAD/4gxYSUNDX1BST0Z', format: 'png'};
    imagePath = 'image.png';
    uploadData = new FormData();

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
    });

    mockHttp = TestBed.get(HttpTestingController);
    service = TestBed.get(UploadService);
  });

  afterEach(() => {
    mockHttp.verify();
  });

  it('should be created', fakeAsync(() => {
    expect(service).toBeTruthy();
  }));

  it('should get image', fakeAsync(() => {
    service.getImage(imagePath).subscribe( img => {
      expect(img.content).toBe(image.content);
      expect(img.format).toBe(img.format);
    });

    const req = mockHttp.expectOne('api/image/' + imagePath);
    expect(req.request.method).toBe('GET');
    req.flush(image);
  }));

  it('should receive client side error', fakeAsync(() => {
    service.getImage(imagePath).subscribe(() => { }, err => {
      expect(err).toBe('Client side error!');
    });

    const req = mockHttp.expectOne('api/image/' + imagePath);
    expect(req.request.method).toBe('GET');
    req.flush(null, { status: 500, statusText: 'Internal Server Error' });
  }));

  it('should receive access denied error', fakeAsync(() => {
    service.getImage(imagePath).subscribe(() => { }, err => {
      expect(err).toBe('Access denied!');
    });

    const req = mockHttp.expectOne('api/image/' + imagePath);
    expect(req.request.method).toBe('GET');
    req.flush('Access denied!', { status: 401, statusText: 'Unathorized' });
  }));

  it('should receive server is down error', fakeAsync(() => {
    service.getImage(imagePath).subscribe(() => { }, err => {
      expect(err).toBe('Server is down!');
    });

    const req = mockHttp.expectOne('api/image/' + imagePath);
    expect(req.request.method).toBe('GET');
    req.flush('Error occured ', { status: 504, statusText: 'Gateway Timeout' });
  }));

  it('should receive vehicle and transport line type error', fakeAsync(() => {
    service.getImage(imagePath).subscribe(() => { }, err => {
      expect(err).toBe('Vehicle and tranport line type do not match!');
    });

    const req = mockHttp.expectOne('api/image/' + imagePath);
    expect(req.request.method).toBe('GET');
    req.flush({ message: 'Vehicle and tranport line type do not match!' },
      { status: 400, statusText: 'Bad Request' });
  }));

  it('should upload image', fakeAsync(() => {
    service.uploadImage(uploadData).subscribe( img => {
      expect(img).toBe(imagePath);
    });

    const req = mockHttp.expectOne(url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBe(uploadData);
    expect(req.request.responseType).toBe('text');
    req.flush(imagePath);
  }));

});
