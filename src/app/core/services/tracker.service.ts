import { Injectable } from '@angular/core';

import * as Stomp from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { TrackedVehicle } from 'src/app/model/vehicle.model';
import { VehicleType } from 'src/app/model/enums/vehicle-type.model';

/**
 * Provides vehicles tracking service
 *
 * @export
 */
@Injectable({
  providedIn: 'root'
})
export class TrackerService {

  private stompClient: Stomp.CompatClient;
  private endpoint: string;

  constructor() {
    this.endpoint = 'http://localhost:8080/gkz-stomp-endpoint';
    this.stompClient = Stomp.Stomp.over(new SockJS(this.endpoint));
  }

  /**
   * Connects to web socket for vehicles tracking
   *
   * @param object vehicles on map
   * @param any mapViewer map viewer
   * @param any busIcon icon for bus
   * @param any metroIcon icon for metro
   * @param any tramIcon icon for tram
   */
  connect(vehicles: object, mapViewer: any, busIcon: any, metroIcon: any, tramIcon: any) {
    const _this = this;
    this.stompClient.connect({}, function () {
      _this.stompClient.subscribe('/topic/hi', function (updatedVehicles) {
        _this.updateVehicles(vehicles, JSON.parse(updatedVehicles.body), mapViewer,
          busIcon, metroIcon, tramIcon);
      });
    });
  }

  /**
   * Disconnects from web socket
   *
   */
  disconnect() {
    if (this.stompClient != null) {
      this.stompClient.disconnect();
    }
  }

  /**
   * Updates vehicles position on map
   *
   * @param object vehicles on map
   * @param TrackedVehicle[] updatedVehicles vehicles with updated position
   * @param any mapViewer map viewer
   * @param any busIcon icon for bus
   * @param any metroIcon icon for metro
   * @param any tramIcon icon for tram
   */
  private updateVehicles(vehicles: object, updatedVehicles: TrackedVehicle[],
    mapViewer: any, busIcon: any, metroIcon: any, tramIcon: any): void {
    for (const id in vehicles) {
        mapViewer.map.removeLayer(vehicles[id]);
    }
    Object.keys(vehicles).forEach(key => { delete vehicles[key]; });
    updatedVehicles.forEach(vehicle => {
      let iconType: any;
      if (vehicle.vehicleType === VehicleType.BUS) {
        iconType = busIcon;
      } else {
        vehicle.vehicleType === VehicleType.METRO ? iconType = metroIcon : iconType = tramIcon;
      }
      vehicles[vehicle.id] = L.marker([vehicle.latitude, vehicle.longitude], { icon: iconType })
        .addTo(mapViewer.map).bindPopup('<p>' + vehicle.name + '</p>');
    });
  }
}
