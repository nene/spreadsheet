import { configureStore, ThunkAction, Action, AnyAction } from '@reduxjs/toolkit';
import { combineEpics, createEpicMiddleware, Epic } from 'redux-observable';
import focus, { focusEpic } from './focus';
import cells from './cells/cellsSlice';

const epicMiddleWare = createEpicMiddleware<AnyAction, AnyAction, any>();

export const store = configureStore({
  reducer: {
    cells,
    focus,
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware({
      // Ignore warning: A non-serializable value was detected in the state
      serializableCheck: {
        ignoredPaths: ['cells'],
      },
    }),
    epicMiddleWare,
  ],
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppEpic = Epic<AnyAction, AnyAction, RootState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

epicMiddleWare.run(combineEpics(
  focusEpic,
));
