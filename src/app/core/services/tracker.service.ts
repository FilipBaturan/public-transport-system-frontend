import { Injectable } from '@angular/core';

import { VehicleService } from './vehicle.service';
import { interval } from 'rxjs';
import { Vehicle } from 'src/app/model/vehicle.model';
import { TransportLine } from 'src/app/model/transport-line.model';
import * as Stomp from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';

/**
 * Provides vehicle tracking service
 *
 * @export
 */
@Injectable({
  providedIn: 'root'
})
export class TrackerService {

  // private running: boolean;
  // private refrashRate: number;
  // private vehicles: Vehicle[];
  // private transportLines: TransportLine[];

  // constructor(private vehicleService: VehicleService) {
  //   this.running = false;
  //   this.refrashRate = 5000;
  //   this.vehicles = [];

  // }

  // start(): void {
  //   if (!this.running) {
  //     this.runTracker();
  //   }
  // }

  // private runTracker(): void {
  //   // fetch vehicles
  //   interval(this.refrashRate).subscribe(() => {
  //     console.log('fetche vehicles');
  //     this.vehicleService.findAll().subscribe(vehicles => this.vehicles = vehicles, () => {});
  //   });
  //   // send updated to server
  //   interval(this.refrashRate + 1000).subscribe(() => {
  //     console.log('send updates');

  //   });
  // }

  // private getRandomInt(min: number, max: number): number {
  //   min = Math.ceil(min);
  //   max = Math.floor(max);
  //   return Math.floor(Math.random() * (max - min + 1)) + min;
  // }

  // private getNextPosition(transportLine: TransportLine) {
  // }

  // private randomPicker(): void {
  //   const vehiclesWithTransportLine = this.vehicles.filter(vehicle => vehicle.currentLine != null);
  //   const numberOfChanges = this.getRandomInt(1, vehiclesWithTransportLine.length);
  //   for (let index = 0; index < numberOfChanges; index++) {
  //     const vehicle = vehiclesWithTransportLine[this.getRandomInt(0, vehiclesWithTransportLine.length - 1)];
  //     const transportLine = this.transportLines
  //       .find(tl => transportLine.id === vehicle.currentLine.id);
  //   }
  // }


  greetings: string[] = [];
  disabled = true;
  name: string;
  private stompClient = null;

  constructor() { }

  setConnected(connected: boolean) {
    this.disabled = !connected;

    if (connected) {
      this.greetings = [];
    }
  }

  connect() {
    const socket = new SockJS('http://localhost:8080/gkz-stomp-endpoint');
    this.stompClient = Stomp.Stomp.over(socket);

    const _this = this;
    this.stompClient.connect({}, function (frame) {
      _this.setConnected(true);
      console.log('Connected: ' + frame);

      _this.stompClient.subscribe('/topic/hi', function (hello) {
        _this.showGreeting(JSON.parse(hello.body).greeting);
      });
    });
  }

  disconnect() {
    if (this.stompClient != null) {
      this.stompClient.disconnect();
    }

    this.setConnected(false);
    console.log('Disconnected!');
  }

  sendName() {
    this.stompClient.send(
      '/gkz/hello',
      {},
      JSON.stringify({ 'name': this.name })
    );
  }

  showGreeting(message) {
    this.greetings.push(message);
  }
}

