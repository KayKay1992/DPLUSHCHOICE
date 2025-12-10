import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { FLUSH, PAUSE, PERSIST, persistReducer, PURGE, REGISTER, REHYDRATE } from "redux-persist";
import storage from "redux-persist/lib/storage";
import cartReducer from "./cartRedux";
import userReducer from "./userRedux";
import persistStore from "redux-persist/es/persistStore";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
//   whitelist: ["cart", "user"],
};

const rootReducer = combineReducers({
  cart: cartReducer,
  user: userReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export let persistor = persistStore(store);