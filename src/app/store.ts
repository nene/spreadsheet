import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import focus from './focus';

export const store = configureStore({
  reducer: {
    focus,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
