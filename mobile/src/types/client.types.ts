export interface Vehicle {
  vehicleId: string;
  plateNumber: string;
  model: string;
  clientId?: string;
  currentSpeed?: number;
  currentFuelLevel?: number;
}

export interface Driver {
  driverId: string;
  fullName: string;
  phone: string;
  vehicleId: string | null;
  isActive: boolean;
}

export interface Dispatcher {
  dispatcherId: string;
  fullName: string;
  email: string;
  phone: string;
}