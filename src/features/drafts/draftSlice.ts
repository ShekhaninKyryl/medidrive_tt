import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";
import type { Draft, DraftSaveStatus, ServiceLogFormData } from "./types";
import { makeDefaultFormData } from "./defaults";

type DraftsState = {
    activeDraftId: string | null;
    drafts: Record<string, Draft>;
    order: string[];
};

const initialState: DraftsState = {
    activeDraftId: null,
    drafts: {},
    order: [],
};

function touchDraft(draft: Draft): Draft {
    return { ...draft, updatedAt: Date.now() };
}

const draftsSlice = createSlice({
    name: "drafts",
    initialState,
    reducers: {
        createDraft: {
            reducer(state, action: PayloadAction<{ id: string; data: ServiceLogFormData }>) {
                const { id, data } = action.payload;
                const now = Date.now();

                state.drafts[id] = {
                    id,
                    data,
                    status: "saved",
                    createdAt: now,
                    updatedAt: now,
                };
                state.order.unshift(id);
                state.activeDraftId = id;
            },
            prepare(data?: Partial<ServiceLogFormData>) {
                const id = nanoid();
                const base = makeDefaultFormData();
                return {
                    payload: {
                        id,
                        data: { ...base, ...(data ?? {}) },
                    },
                };
            },
        },

        selectDraft(state, action: PayloadAction<string>) {
            const id = action.payload;
            if (state.drafts[id]) state.activeDraftId = id;
        },

        deleteDraft(state, action: PayloadAction<string>) {
            const id = action.payload;
            if (!state.drafts[id]) return;

            delete state.drafts[id];
            state.order = state.order.filter((x) => x !== id);

            if (state.activeDraftId === id) {
                state.activeDraftId = state.order[0] ?? null;
            }
        },

        clearAllDrafts(state) {
            state.drafts = {};
            state.order = [];
            state.activeDraftId = null;
        },

        patchActiveDraftData(state, action: PayloadAction<Partial<ServiceLogFormData>>) {
            const id = state.activeDraftId;
            if (!id) return;
            const draft = state.drafts[id];
            if (!draft) return;

            state.drafts[id] = touchDraft({
                ...draft,
                status: "dirty",
                data: { ...draft.data, ...action.payload },
            });
        },

        setActiveDraftStatus(state, action: PayloadAction<DraftSaveStatus>) {
            const id = state.activeDraftId;
            if (!id) return;
            const draft = state.drafts[id];
            if (!draft) return;

            state.drafts[id] = touchDraft({ ...draft, status: action.payload });
        },

        setActiveDraftData(state, action: PayloadAction<ServiceLogFormData>) {
            const id = state.activeDraftId;
            if (!id) return;
            const draft = state.drafts[id];
            if (!draft) return;

            state.drafts[id] = touchDraft({ ...draft, data: action.payload, status: "dirty" });
        },
    },
});

export const {
    createDraft,
    selectDraft,
    deleteDraft,
    clearAllDrafts,
    patchActiveDraftData,
    setActiveDraftStatus,
    setActiveDraftData,
} = draftsSlice.actions;

export default draftsSlice.reducer;
