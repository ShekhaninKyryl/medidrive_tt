import { createSlice } from "@reduxjs/toolkit";

type LogsState = {};

const initialState: LogsState = {};

const logsSlice = createSlice({
    name: "logs",
    initialState,
    reducers: {},
});

export default logsSlice.reducer;
