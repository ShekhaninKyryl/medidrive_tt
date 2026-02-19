import { createSlice } from "@reduxjs/toolkit";

type DraftsState = {
    activeDraftId: string | null;
};

const initialState: DraftsState = {
    activeDraftId: null,
};

const draftsSlice = createSlice({
    name: "drafts",
    initialState,
    reducers: {},
});

export default draftsSlice.reducer;
