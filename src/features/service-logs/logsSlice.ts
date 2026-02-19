import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";
import type { ServiceLog } from "./types";
import type { ServiceLogFormData } from "../drafts/types";

type LogsState = {
    logs: Record<string, ServiceLog>;
    order: string[];
};

const initialState: LogsState = {
    logs: {},
    order: [],
};

function touchLog(log: ServiceLog): ServiceLog {
    return { ...log, updatedAt: Date.now() };
}

const logsSlice = createSlice({
    name: "logs",
    initialState,
    reducers: {
        addLog: {
            reducer(state, action: PayloadAction<{ id: string; data: ServiceLogFormData }>) {
                const { id, data } = action.payload;
                const now = Date.now();

                state.logs[id] = { id, data, createdAt: now, updatedAt: now };
                state.order.unshift(id);
            },
            prepare(data: ServiceLogFormData) {
                return { payload: { id: nanoid(), data } };
            },
        },

        updateLog(state, action: PayloadAction<{ id: string; data: ServiceLogFormData }>) {
            const { id, data } = action.payload;
            const existing = state.logs[id];
            if (!existing) return;

            state.logs[id] = touchLog({ ...existing, data });
        },

        deleteLog(state, action: PayloadAction<string>) {
            const id = action.payload;
            if (!state.logs[id]) return;

            delete state.logs[id];
            state.order = state.order.filter((x) => x !== id);
        },

        clearAllLogs(state) {
            state.logs = {};
            state.order = [];
        },
    },
});

export const { addLog, updateLog, deleteLog, clearAllLogs } = logsSlice.actions;
export default logsSlice.reducer;
