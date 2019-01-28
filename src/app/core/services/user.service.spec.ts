import { TestBed, fakeAsync } from '@angular/core/testing';
import { UserService } from './user.service';
import { User } from '../../model/users/user.model';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrService } from 'ngx-toastr';

describe('UserService', () => {

  const url: string = '/api/user';
  let dbUsers: User[];

  let mockToastrService: any;
  let mockHttp: HttpTestingController;
  let service: UserService;

  let randomUser = new User(1, "un1", "111", "Name1", "Lastname1", "email1", true, "1111");
  let unacceptedUser = new User(1, "unacc1", "111", "Not", "Accepted", "iAmNotAcc@gmail.com", true, "1111");
  let notRegisteredUser = new User(7, "un1", "111", "Name1", "Lastname1", "email1", true, "1111");
  let notexistedUser = new User(555333, "un1", "111", "Name1", "Lastname1", "email1", true, "1111");
  let validatorToUpdate = new User(1, "unVal", "pasVal", "ValName", "ValLast", "emailVal", true, "1111");
  let validatorToAdd =  new User(null, "unVal", "pasVal", "ValName", "ValLast", "emailVal", true, "1111");
  
  let unvalidatedUsersUrl = url + '/unvalidatedUsers/';
  let acceptUserUrl = url + '/approveUser/';
  let denyUserUrl = url + "/denyUser/";
  let getValidatorsUrl = url + "/getValidators/";
  let updateValidatorUrl = url + "/updateValidator/";
  let addValidatorUrl = url + "/addValidator/";
  let getRegUsersUrl = url + "/registeredUsers/";
  let getByUsernameUrl = url + "/getByUsername/" + randomUser.username + "/";

  beforeEach(() => {
    
    dbUsers = [
      new User(1, "un1", "111", "Name1", "Lastname1", "email1", true, "1111"),
      new User(2, "un2", "222", "Name2", "Lastname2", "email2", true, "2222"),
      new User(3, "un3", "333", "Name3", "Lastname3", "email3", true, "3333"),
      new User(4, "un4", "444", "Name4", "Lastname4", "email4", true, "4444"),
      new User(5, "un5", "555", "Name5", "Lastname5", "email5", true, "5555"),
    ];

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
    service = TestBed.get(UserService);
  });

  afterEach(() => {
    mockHttp.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Uncorfirmed users test
  it('should get all available users', fakeAsync(() => {
    service.getUnconfirmedUsers().subscribe(stations => {
      expect(stations.length).toBe(dbUsers.length);
      expect(stations[0]).toEqual(dbUsers[0]);
      expect(stations[1]).toEqual(dbUsers[1]);
      expect(stations[2]).toEqual(dbUsers[2]);
      expect(stations[3]).toEqual(dbUsers[3]);
      expect(stations[4]).toEqual(dbUsers[4]);
    });

    const req = mockHttp.expectOne(unvalidatedUsersUrl);
    expect(req.request.method).toBe('GET');
    req.flush(dbUsers);
  }));

  it('should receive client side error', fakeAsync(() => {
    service.getUnconfirmedUsers().subscribe(() => { }, err => {
      expect(err).toBe('Client side error!');
    });

    const req = mockHttp.expectOne(unvalidatedUsersUrl);
    expect(req.request.method).toBe('GET');
    req.flush(null, { status: 500, statusText: 'Internal Server Error' });
  }));

  it('should receive server is down error', fakeAsync(() => {
    service.getUnconfirmedUsers().subscribe(() => { }, err => {
      expect(err).toBe('Server is down!');
    });

    const req = mockHttp.expectOne(unvalidatedUsersUrl);
    expect(req.request.method).toBe('GET');
    req.flush("Error occured", { status: 502, statusText: 'Bad Gateway' });
  }));

  it('should receive unathorized error', fakeAsync(() => {
    service.getUnconfirmedUsers().subscribe(() => { }, err => {
      expect(err).toBe("Unathorized");
    });

    const req = mockHttp.expectOne(unvalidatedUsersUrl);
    expect(req.request.method).toBe('GET');
    req.flush("Unathorized", { status: 403, statusText: 'Unathorized' });
  }));

  it('should receive username alraedy exists error', fakeAsync(() => {
    service.getUnconfirmedUsers().subscribe(() => { }, err => {
      expect(err).toBe('Username alraedy exists!');
    });

    const req = mockHttp.expectOne(unvalidatedUsersUrl);
    expect(req.request.method).toBe('GET');
    req.flush({ message: 'Username alraedy exists!' },
      { status: 400, statusText: 'Bad Request' });
  }));

  // Accept user tests

  it('should accept given user', fakeAsync(() => {
    service.acceptUser(unacceptedUser).subscribe(response => {
      expect(response).toBe(unacceptedUser);
    });

    const req = mockHttp.expectOne(acceptUserUrl);
    expect(req.request.method).toBe('PUT');
    req.flush( unacceptedUser );
  }));

  it('should receive client side error', fakeAsync(() => {
    service.getUnconfirmedUsers().subscribe(() => { }, err => {
      expect(err).toBe('Client side error!');
    });

    const req = mockHttp.expectOne(unvalidatedUsersUrl);
    expect(req.request.method).toBe('GET');
    req.flush(null, { status: 500, statusText: 'Internal Server Error' });
  }));

  it('should receive access denied error', fakeAsync(() => {
    service.getUnconfirmedUsers().subscribe(() => { }, err => {
      expect(err).toBe('Server is down!');
    });

    const req = mockHttp.expectOne(unvalidatedUsersUrl);
    expect(req.request.method).toBe('GET');
    req.flush("Error occured", { status: 401, statusText: 'Unathorized' });
  }));

  it('should receive server is down error', fakeAsync(() => {
    service.getUnconfirmedUsers().subscribe(() => { }, err => {
      expect(err).toBe("Unathorized");
    });

    const req = mockHttp.expectOne(unvalidatedUsersUrl);
    expect(req.request.method).toBe('GET');
    req.flush("Unathorized", { status: 403, statusText: 'Unathorized' });
  }));


  // Deny user tests
  it('should deny given user', fakeAsync(() => {
    service.denyUser(unacceptedUser).subscribe(response => {
      expect(response).toBe(unacceptedUser);
     
    });

    const req = mockHttp.expectOne(denyUserUrl);
    expect(req.request.method).toBe('PUT');
    req.flush(unacceptedUser);
  }));

  // Get validators tests

  it('should get all validators', fakeAsync(() => {
    service.getValidators().subscribe(validators => {
      expect(validators.length).toBe(dbUsers.length);
      expect(validators[0]).toEqual(dbUsers[0]);
      expect(validators[1]).toEqual(dbUsers[1]);
      expect(validators[2]).toEqual(dbUsers[2]);
      expect(validators[3]).toEqual(dbUsers[3]);
      expect(validators[4]).toEqual(dbUsers[4]);
    });

    const req = mockHttp.expectOne(getValidatorsUrl);
    expect(req.request.method).toBe('GET');
    req.flush(dbUsers);
  }));

  // Update validator tests

  it('should update given validator', fakeAsync(() => {
    service.updateValidator(validatorToUpdate).subscribe(response => {
      expect(response).toBe(validatorToUpdate);
     
    });

    const req = mockHttp.expectOne(updateValidatorUrl);
    expect(req.request.method).toBe('PUT');
    req.flush( validatorToUpdate);
  }));

  // Add validator tests

  it('should add given validator', fakeAsync(() => {
    service.addValidator(validatorToAdd).subscribe(response => {
      expect(response).toBe(validatorToAdd);
     
    });

    const req = mockHttp.expectOne(addValidatorUrl);
    expect(req.request.method).toBe('POST');
    req.flush( validatorToAdd);
  }));

  // Get registered users tests
  it('should get all registered users', fakeAsync(() => {
    service.getRegUsers().subscribe(regUsers => {
      expect(regUsers.length).toBe(dbUsers.length);
      expect(regUsers[0]).toEqual(dbUsers[0]);
      expect(regUsers[1]).toEqual(dbUsers[1]);
      expect(regUsers[2]).toEqual(dbUsers[2]);
      expect(regUsers[3]).toEqual(dbUsers[3]);
      expect(regUsers[4]).toEqual(dbUsers[4]);
    });

    const req = mockHttp.expectOne(getRegUsersUrl);
    expect(req.request.method).toBe('GET');
    req.flush(dbUsers);
  }));

  // Get by username tests
  it('should get a user with given username', fakeAsync(() => {
    service.getByUsername(randomUser.username).subscribe(user => {
      expect(user.username).toBe(randomUser.username);
      expect(user.firstName).toBe(randomUser.firstName);
      expect(user.lastName).toBe(randomUser.lastName);
      expect(user.email).toBe(randomUser.email);
    });

    const req = mockHttp.expectOne(getByUsernameUrl);
    expect(req.request.method).toBe('GET');
    req.flush(randomUser);
  }));

});

