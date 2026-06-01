import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../../../shared/api/client';

export interface Vehicle {
  vehicleId: string;
  plateNumber: string;
  model: string;
  vehicleType?: string;
  currentSpeed?: number;
  currentFuelLevel?: number;
  latitude?: number;
  longitude?: number;
  ignitionStatus?: boolean;
  lastUpdateTime?: string;
}

export interface Report {
  reportId: string;
  eventId: string;
  format: string;
  fileUrl: string;
  generatedAt: string;
  sentToEmail?: string;
}

interface ClientState {
  vehicles: Vehicle[];
  reports: Report[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ClientState = {
  vehicles: [],
  reports: [],
  isLoading: false,
  error: null,
};

// Получить все ТС клиента
export const fetchVehicles = createAsyncThunk(
  'client/fetchVehicles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/vehicles');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch vehicles');
    }
  }
);

// Создать ТС
export const createVehicle = createAsyncThunk(
  'client/createVehicle',
  async ({ vehicle, clientId }: { vehicle: Partial<Vehicle>; clientId: string }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/vehicles?clientId=${clientId}`, vehicle);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create vehicle');
    }
  }
);

// Обновить ТС
export const updateVehicle = createAsyncThunk(
  'client/updateVehicle',
  async ({ vehicleId, vehicle }: { vehicleId: string; vehicle: Partial<Vehicle> }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/vehicles/${vehicleId}`, vehicle);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update vehicle');
    }
  }
);

// Удалить ТС
export const deleteVehicle = createAsyncThunk(
  'client/deleteVehicle',
  async (vehicleId: string, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/vehicles/${vehicleId}`);
      return vehicleId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete vehicle');
    }
  }
);

// Получить отчёты
export const fetchReports = createAsyncThunk(
  'client/fetchReports',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/reports');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reports');
    }
  }
);

const clientSlice = createSlice({
  name: 'client',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchVehicles
      .addCase(fetchVehicles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchVehicles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.vehicles = action.payload;
      })
      .addCase(fetchVehicles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // createVehicle
      .addCase(createVehicle.fulfilled, (state, action) => {
        state.vehicles.push(action.payload);
      })
      // updateVehicle
      .addCase(updateVehicle.fulfilled, (state, action) => {
        const index = state.vehicles.findIndex(v => v.vehicleId === action.payload.vehicleId);
        if (index !== -1) {
          state.vehicles[index] = action.payload;
        }
      })
      // deleteVehicle
      .addCase(deleteVehicle.fulfilled, (state, action) => {
        state.vehicles = state.vehicles.filter(v => v.vehicleId !== action.payload);
      })
      // fetchReports
      .addCase(fetchReports.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reports = action.payload;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = clientSlice.actions;
export default clientSlice.reducer;