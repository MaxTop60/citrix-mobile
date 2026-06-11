import { apiClient } from '../../../shared/api/client';
import { Event, Command } from '../../../types';

export const eventsApi = {
  fetchEvents: (): Promise<Event[]> => 
    apiClient.get('/events').then(res => res.data),
  
  fetchEventById: (eventId: string): Promise<Event> => 
    apiClient.get(`/events/${eventId}`).then(res => res.data),
  
  updateEventStatus: (eventId: string, status: string): Promise<Event> => 
    apiClient.put(`/events/${eventId}/status?status=${status}`).then(res => res.data),
  
  sendCommand: (eventId: string, message: string): Promise<Command> => 
    apiClient.post('/commands', { eventId, message }).then(res => res.data),
  
  fetchDriverCommands: (): Promise<Command[]> => 
    apiClient.get('/commands/my').then(res => res.data),
  
  confirmCommand: (commandId: string, responseType: string, content: string): Promise<Command> => 
    apiClient.post(`/commands/${commandId}/confirm`, { responseType, content }).then(res => res.data),
};