import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  PURGE,
  REGISTER,
  REHYDRATE,
  createMigrate,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import cartReducer from "./cartRedux";
import userReducer from "./userRedux";
import persistStore from "redux-persist/es/persistStore";

const migrations = {
  1: (state) => {
    // Migration for cart structure changes
    const newState = { ...state };

    if (newState.cart) {
      // If cart exists but doesn't have the new structure
      if (!newState.cart.userCarts) {
        newState.cart.userCarts = {};
      }

      // Convert old guestCart array to new structure
      if (Array.isArray(newState.cart.guestCart)) {
        newState.cart.guestCart = {
          products: newState.cart.guestCart,
          quantity: newState.cart.guestCart.reduce(
            (total, p) => total + p.quantity,
            0
          ),
          total: newState.cart.guestCart.reduce(
            (total, p) => total + p.price * p.quantity,
            0
          ),
        };
      } else if (!newState.cart.guestCart) {
        newState.cart.guestCart = {
          products: [],
          quantity: 0,
          total: 0,
        };
      }

      // Ensure currentUserId exists
      if (!newState.cart.currentUserId) {
        newState.cart.currentUserId = null;
      }
    }

    return newState;
  },
};

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  migrate: createMigrate(migrations, { debug: false }),
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
