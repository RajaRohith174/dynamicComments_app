import {configureStore} from '@reduxjs/toolkit';
import {persistReducer, persistStore} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {combineReducers} from '@reduxjs/toolkit';
import {PersistConfig} from 'redux-persist';
import commentsReducer from './reducers/commentsReducer';

const persistConfig: PersistConfig<any> = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
};

const rootReducer = combineReducers({
  comments: commentsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
