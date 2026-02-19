import { Paper, Stack } from "@mui/material";
import { DraftsPanel } from "../features/drafts/DraftPanel";
import { ServiceLogForm } from "../features/drafts/ServiceLogForm";
import { ServiceLogsTable } from "../features/service-logs/ServiceLogsTable";

export function ServiceLogsPage() {
    return (
        <>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mt: 3 }}>
                <Paper variant="outlined" sx={{ p: 2, width: { xs: "100%", md: 360 }, borderRadius: 3 }}>
                    <DraftsPanel />
                </Paper>

                <Paper variant="outlined" sx={{ p: 2, flex: 1, borderRadius: 3 }}>
                    <ServiceLogForm />
                </Paper>
            </Stack>

            <ServiceLogsTable />
        </>
    );
}
