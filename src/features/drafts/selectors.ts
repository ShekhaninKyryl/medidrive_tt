import type { RootState } from "../../app/store";

export const selectDraftsOrder = (s: RootState) => s.drafts.order;
export const selectDraftById = (id: string) => (s: RootState) => s.drafts.drafts[id];
export const selectActiveDraftId = (s: RootState) => s.drafts.activeDraftId;
export const selectActiveDraft = (s: RootState) => {
    const id = s.drafts.activeDraftId;
    return id ? s.drafts.drafts[id] : null;
};
