import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiClient } from '../../../shared/api/client';

export interface Event {
  eventId: string;
  vehicleId: string;
  eventType: string;
  priority: string;
  status: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  description: string;
}

interface FilterState {
  eventType: string | null;
  priority: string | null;
  status: string | null;
}

interface EventsState {
  events: Event[];
  filteredEvents: Event[];
  currentEvent: Event | null;
  commands: DriverCommand[];         
  currentCommand: DriverCommand | null;
  isLoading: boolean;
  error: string | null;
  filters: FilterState;
}

export interface DriverCommand {
  commandId: string;
  eventId: string;
  message: string;
  channel: string;
  status: string;
  sentAt: string;
  deliveredAt: string | null;
  readAt: string | null;
  errorMessage: string | null;
}

const initialState: EventsState = {
  events: [],
  filteredEvents: [],
  currentEvent: null,
  commands: [],
  currentCommand: null,
  isLoading: false,
  error: null,
  filters: {
    eventType: null,
    priority: null,
    status: null,
  },
};

// Получить все события
export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/events');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch events');
    }
  }
);

// Получить событие по ID
export const fetchEventById = createAsyncThunk(
  'events/fetchEventById',
  async (eventId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/events/${eventId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch event');
    }
  }
);

// Обновить статус события
export const updateEventStatus = createAsyncThunk(
  'events/updateEventStatus',
  async ({ eventId, status }: { eventId: string; status: string }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/events/${eventId}/status?status=${status}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update status');
    }
  }
);

// Отправить команду водителю
export const sendCommand = createAsyncThunk(
  'events/sendCommand',
  async ({ eventId, message }: { eventId: string; message: string }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/commands', { eventId, message });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send command');
    }
  }
);

// Получить команды для водителя
export const fetchDriverCommands = createAsyncThunk(
  'events/fetchDriverCommands',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/commands/my');  // ← меняем на /my
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch commands');
    }
  }
);

// Получить команду по ID
export const fetchCommandById = createAsyncThunk(
  'events/fetchCommandById',
  async (commandId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/commands/${commandId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch command');
    }
  }
);

// Подтвердить команду (с фото или текстом)
export const confirmCommand = createAsyncThunk(
  'events/confirmCommand',
  async ({ commandId, responseType, content }: { commandId: string; responseType: string; content: string }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/commands/${commandId}/confirm`, {
        responseType,
        content,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to confirm command');
    }
  }
);

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentEvent: (state) => {
      state.currentEvent = null;
    },
    setFilter: (state, action: PayloadAction<{ type: keyof FilterState; value: string | null }>) => {
      const { type, value } = action.payload;
      state.filters[type] = value;
      // Применяем фильтры
      state.filteredEvents = state.events.filter(event => {
        if (state.filters.eventType && event.eventType !== state.filters.eventType) return false;
        if (state.filters.priority && event.priority !== state.filters.priority) return false;
        if (state.filters.status && event.status !== state.filters.status) return false;
        return true;
      });
    },
    resetFilters: (state) => {
      state.filters = {
        eventType: null,
        priority: null,
        status: null,
      };
      state.filteredEvents = state.events;
    },
    applyFilters: (state) => {
      state.filteredEvents = state.events.filter(event => {
        if (state.filters.eventType && event.eventType !== state.filters.eventType) return false;
        if (state.filters.priority && event.priority !== state.filters.priority) return false;
        if (state.filters.status && event.status !== state.filters.status) return false;
        return true;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchEvents
      .addCase(fetchEvents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events = action.payload;
        // Применяем текущие фильтры к новым данным
        state.filteredEvents = action.payload.filter(event => {
          if (state.filters.eventType && event.eventType !== state.filters.eventType) return false;
          if (state.filters.priority && event.priority !== state.filters.priority) return false;
          if (state.filters.status && event.status !== state.filters.status) return false;
          return true;
        });
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // fetchEventById
      .addCase(fetchEventById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentEvent = action.payload;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // updateEventStatus
      .addCase(updateEventStatus.fulfilled, (state, action) => {
        const index = state.events.findIndex(e => e.eventId === action.payload.eventId);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
        // Обновляем в filteredEvents
        const filteredIndex = state.filteredEvents.findIndex(e => e.eventId === action.payload.eventId);
        if (filteredIndex !== -1) {
          state.filteredEvents[filteredIndex] = action.payload;
        }
        if (state.currentEvent?.eventId === action.payload.eventId) {
          state.currentEvent = action.payload;
        }
      })

      // fetchDriverCommands
      .addCase(fetchDriverCommands.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDriverCommands.fulfilled, (state, action) => {
        state.isLoading = false;
        state.commands = action.payload;
      })
      .addCase(fetchDriverCommands.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // fetchCommandById
      .addCase(fetchCommandById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCommandById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCommand = action.payload;
      })
      .addCase(fetchCommandById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // confirmCommand
      .addCase(confirmCommand.fulfilled, (state, action) => {
        const index = state.commands.findIndex(c => c.commandId === action.payload.commandId);
        if (index !== -1) {
          state.commands[index] = action.payload;
        }
        if (state.currentCommand?.commandId === action.payload.commandId) {
          state.currentCommand = action.payload;
        }
      });
  },
});

export const { clearError, clearCurrentEvent, setFilter, resetFilters, applyFilters } = eventsSlice.actions;
export default eventsSlice.reducer;