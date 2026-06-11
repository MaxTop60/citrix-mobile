import { apiClient } from '../../../shared/api/client';
import { Vehicle, Driver } from '../../../types';

export const clientApi = {
  // Vehicles
  fetchVehicles: (): Promise<Vehicle[]> => 
    apiClient.get('/vehicles').then(res => res.data),
  
  createVehicle: (vehicle: Partial<Vehicle>): Promise<Vehicle> => 
    apiClient.post('/vehicles', vehicle).then(res => res.data),
  
  updateVehicle: (vehicleId: string, vehicle: Partial<Vehicle>): Promise<Vehicle> => 
    apiClient.put(`/vehicles/${vehicleId}`, vehicle).then(res => res.data),
  
  deleteVehicle: (vehicleId: string): Promise<void> => 
    apiClient.delete(`/vehicles/${vehicleId}`).then(() => {}),
  
  // Drivers
  fetchDrivers: (): Promise<Driver[]> => 
    apiClient.get('/drivers').then(res => res.data),
  
  assignVehicleToDriver: (driverId: string, vehicleId: string): Promise<void> => 
    apiClient.put(`/drivers/${driverId}/assign-vehicle?vehicleId=${vehicleId}`).then(() => {}),
  
  unassignVehicleFromDriver: (driverId: string): Promise<void> => 
    apiClient.delete(`/drivers/${driverId}/unassign-vehicle`).then(() => {}),
};