import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/model/authSlice';
import eventsReducer from '../features/events/model/eventsSlice';
import clientReducer from '../features/client/model/clientSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer,
    client: clientReducer,
  },
});

// Типы для TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;