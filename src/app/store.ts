import { configureStore, AnyAction } from '@reduxjs/toolkit';
import { combineEpics, createEpicMiddleware, Epic } from 'redux-observable';
import focus, { focusEpic } from './focus';
import cells, { cellsEpic } from './cells/cellsSlice';
import focusAreas from './focusAreas';
import namedAreas from './namedAreas';

const epicMiddleWare = createEpicMiddleware<AnyAction, AnyAction, any>();

export const store = configureStore({
  reducer: {
    cells,
    focus,
    focusAreas,
    namedAreas,
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware({
      // Ignore warning: A non-serializable value was detected in the state
      serializableCheck: {
        ignoredPaths: ['cells'],
      },
      thunk: false
    }),
    epicMiddleWare,
  ],
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppEpic = Epic<AnyAction, AnyAction, RootState>;

epicMiddleWare.run(combineEpics(
  focusEpic,
  cellsEpic,
));
