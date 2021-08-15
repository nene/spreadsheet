import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import focus from './focus';
import cells from './cells/cellsSlice';

export const store = configureStore({
  reducer: {
    cells,
    focus,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    // Ignore warning: A non-serializable value was detected in the state
    serializableCheck: {
      ignoredPaths: ['cells'],
    },
  }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
