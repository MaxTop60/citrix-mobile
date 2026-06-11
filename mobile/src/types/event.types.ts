export interface Event {
  eventId: string;
  vehicleId: string;
  eventType: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'NEW' | 'IN_PROGRESS' | 'CLOSED' | 'REJECTED';
  timestamp: string;
  latitude: number;
  longitude: number;
  description: string;
}

export interface Command {
  commandId: string;
  eventId: string;
  driverId: string;
  message: string;
  channel: string;
  status: 'SENT' | 'DELIVERED' | 'READ' | 'RESPONDED' | 'ERROR';
  sentAt: string;
  deliveredAt: string | null;
  errorMessage: string | null;
}

export interface FilterState {
  eventType: string | null;
  priority: string | null;
  status: string | null;
}export interface Event {
  eventId: string;
  vehicleId: string;
  eventType: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'NEW' | 'IN_PROGRESS' | 'CLOSED' | 'REJECTED';
  timestamp: string;
  latitude: number;
  longitude: number;
  description: string;
}

export interface Command {
  commandId: string;
  eventId: string;
  driverId: string;
  message: string;
  channel: string;
  status: 'SENT' | 'DELIVERED' | 'READ' | 'RESPONDED' | 'ERROR';
  sentAt: string;
  deliveredAt: string | null;
  errorMessage: string | null;
}

export interface FilterState {
  eventType: string | null;
  priority: string | null;
  status: string | null;
}