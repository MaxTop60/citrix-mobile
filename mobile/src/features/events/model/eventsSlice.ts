import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { eventsApi } from '../api/eventsApi';
import { Event, Command, FilterState } from '../../../types';

interface EventsState {
  events: Event[];
  filteredEvents: Event[];
  currentEvent: Event | null;
  commands: Command[];
  isLoading: boolean;
  error: string | null;
  filters: FilterState;
}

const initialState: EventsState = {
  events: [],
  filteredEvents: [],
  currentEvent: null,
  commands: [],
  isLoading: false,
  error: null,
  filters: { eventType: null, priority: null, status: null },
};

// Thunks
export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (_, { rejectWithValue }) => {
    try {
      return await eventsApi.fetchEvents();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch events');
    }
  }
);

export const fetchEventById = createAsyncThunk(
  'events/fetchEventById',
  async (eventId: string, { rejectWithValue }) => {
    try {
      return await eventsApi.fetchEventById(eventId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch event');
    }
  }
);

export const updateEventStatus = createAsyncThunk(
  'events/updateEventStatus',
  async ({ eventId, status }: { eventId: string; status: string }, { rejectWithValue }) => {
    try {
      return await eventsApi.updateEventStatus(eventId, status);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update status');
    }
  }
);

export const sendCommand = createAsyncThunk(
  'events/sendCommand',
  async ({ eventId, message }: { eventId: string; message: string }, { rejectWithValue }) => {
    try {
      return await eventsApi.sendCommand(eventId, message);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send command');
    }
  }
);

export const fetchDriverCommands = createAsyncThunk(
  'events/fetchDriverCommands',
  async (_, { rejectWithValue }) => {
    try {
      return await eventsApi.fetchDriverCommands();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch commands');
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
    setFilter: (state, action) => {
      const { type, value } = action.payload;
      state.filters[type] = value;
      state.filteredEvents = applyFilters(state.events, state.filters);
    },
    resetFilters: (state) => {
      state.filters = { eventType: null, priority: null, status: null };
      state.filteredEvents = state.events;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events = action.payload;
        state.filteredEvents = applyFilters(action.payload, state.filters);
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentEvent = action.payload;
      })
      .addCase(updateEventStatus.fulfilled, (state, action) => {
        const index = state.events.findIndex(e => e.eventId === action.payload.eventId);
        if (index !== -1) state.events[index] = action.payload;
        state.filteredEvents = applyFilters(state.events, state.filters);
      })
      .addCase(fetchDriverCommands.fulfilled, (state, action) => {
        state.isLoading = false;
        state.commands = action.payload;
      });
  },
});

// Хелпер-функция
const applyFilters = (events: Event[], filters: FilterState): Event[] => {
  return events.filter(event => {
    if (filters.eventType && event.eventType !== filters.eventType) return false;
    if (filters.priority && event.priority !== filters.priority) return false;
    if (filters.status && event.status !== filters.status) return false;
    return true;
  });
};

export const { clearError, clearCurrentEvent, setFilter, resetFilters } = eventsSlice.actions;
export default eventsSlice.reducer;