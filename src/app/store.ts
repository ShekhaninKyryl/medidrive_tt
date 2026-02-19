import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import draftsReducer from "../features/drafts/draftSlice";
import logsReducer from "../features/service-logs/logsSlice";

const rootReducer = combineReducers({
    drafts: draftsReducer,
    logs: logsReducer,
});

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["drafts", "logs"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
