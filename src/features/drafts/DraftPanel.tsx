import {
    Box,
    Button,
    Divider,
    List,
    ListItemButton,
    ListItemText,
    Stack,
    Typography,
    Chip,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { createDraft, selectDraft } from "./draftSlice";
import { selectActiveDraftId, selectDraftsOrder, selectDraftById } from "./selectors";

function StatusPill({ status }: { status: string }) {
    if (status !== "saved") return null;
    return (
        <Chip
            icon={<CheckCircleIcon />}
            size="small"
            label="Saved"
            color="success"
            variant="outlined"
            sx={{ ml: 1 }}
        />
    );
}

export function DraftsPanel() {
    const dispatch = useAppDispatch();
    const order = useAppSelector(selectDraftsOrder);
    const activeId = useAppSelector(selectActiveDraftId);

    return (
        <Box>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="h6" fontWeight={700}>
                    Drafts
                </Typography>
                <Button size="small" variant="contained" onClick={() => dispatch(createDraft())}>
                    + Draft
                </Button>
            </Stack>

            <Divider sx={{ mb: 1 }} />

            {!order || order.length === 0 ? (
                <Typography color="text.secondary">No drafts yet.</Typography>
            ) : (
                <List dense sx={{ p: 0 }}>
                    {order.map((id) => (
                        <DraftRow key={id} id={id} selected={id === activeId} onSelect={() => dispatch(selectDraft(id))} />
                    ))}
                </List>
            )}
        </Box>
    );
}

function DraftRow({ id, selected, onSelect }: { id: string; selected: boolean; onSelect: () => void }) {
    const draft = useAppSelector(selectDraftById(id));
    if (!draft) return null;

    return (
        <ListItemButton selected={selected} onClick={onSelect} sx={{ borderRadius: 2, mb: 0.5 }}>
            <ListItemText
                primary={
                    <Stack direction="row" alignItems="center">
                        <Typography fontWeight={700} variant="body2">
                            {draft.data.serviceOrder ? `SO: ${draft.data.serviceOrder}` : "Untitled draft"}
                        </Typography>
                        <StatusPill status={draft.status} />
                    </Stack>
                }
                secondary={`Updated: ${new Date(draft.updatedAt).toLocaleString()}`}
            />
        </ListItemButton>
    );
}
