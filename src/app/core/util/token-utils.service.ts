import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenUtilsService {

  constructor() { }

  getRoles(token: string) {
    const jwtData = token.split('.')[1];
    const decodedJwtDataJson = window.atob(jwtData);
    const decodedJwtData = JSON.parse(decodedJwtDataJson);
    console.log(decodedJwtData.authorities.split(','));
    return decodedJwtData.authorities.split(',');
  }
}