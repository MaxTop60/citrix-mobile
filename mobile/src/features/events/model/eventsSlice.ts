import { createSlice, createAsyncThunk} from '@reduxjs/toolkit';
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

interface EventsState {
  events: Event[];
  currentEvent: Event | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: EventsState = {
  events: [],
  currentEvent: null,
  isLoading: false,
  error: null,
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
      .addCase(updateEventStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateEventStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        // Обновляем статус в списке событий
        const index = state.events.findIndex(e => e.eventId === action.payload.eventId);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
        if (state.currentEvent?.eventId === action.payload.eventId) {
          state.currentEvent = action.payload;
        }
      })
      .addCase(updateEventStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentEvent } = eventsSlice.actions;
export default eventsSlice.reducer;