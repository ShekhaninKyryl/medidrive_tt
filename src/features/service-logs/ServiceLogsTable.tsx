import React from "react";
import {
    Box,
    Button,
    IconButton,
    Paper,
    Stack,
    TextField,
    Typography,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { deleteLog, updateLog } from "./logsSlice";
import type { ServiceType, ServiceLogFormData } from "../drafts/types";
import { selectFilteredLogs, type LogsFilters } from "./selectors";
import { EditLogDialog } from "./EditLogDialog";

const DEFAULT_FILTERS: LogsFilters = {
    q: "",
    type: "all",
    startFrom: "",
    startTo: "",
};

export function ServiceLogsTable() {
    const dispatch = useAppDispatch();
    const [filters, setFilters] = React.useState<LogsFilters>(DEFAULT_FILTERS);

    const logs = useAppSelector(selectFilteredLogs(filters));

    const [editOpen, setEditOpen] = React.useState(false);
    const [editId, setEditId] = React.useState<string | null>(null);

    const [confirmOpen, setConfirmOpen] = React.useState(false);
    const [deleteId, setDeleteId] = React.useState<string | null>(null);

    const editInitial: ServiceLogFormData | null = React.useMemo(() => {
        if (!editId) return null;
        const found = logs.find((l) => l.id === editId);
        return found?.data ?? null;
    }, [editId, logs]);

    const rows = React.useMemo(
        () =>
            logs.map((l) => ({
                id: l.id,
                providerId: l.data.providerId,
                serviceOrder: l.data.serviceOrder,
                carId: l.data.carId,
                startDate: l.data.startDate,
                endDate: l.data.endDate,
                type: l.data.type,
                odometerMi: l.data.odometerMi ?? "",
                engineHours: l.data.engineHours ?? "",
                serviceDescription: l.data.serviceDescription,
            })),
        [logs]
    );

    const columns = React.useMemo<GridColDef[]>(
        () => [
            { field: "serviceOrder", headerName: "Service Order", flex: 1, minWidth: 140 },
            { field: "providerId", headerName: "Provider", flex: 1, minWidth: 140 },
            { field: "carId", headerName: "Car", flex: 1, minWidth: 140 },
            { field: "startDate", headerName: "Start", width: 120 },
            { field: "endDate", headerName: "End", width: 120 },
            { field: "type", headerName: "Type", width: 130 },
            { field: "odometerMi", headerName: "Odometer", width: 120 },
            { field: "engineHours", headerName: "Engine Hours", width: 130 },
            {
                field: "actions",
                headerName: "Actions",
                width: 120,
                sortable: false,
                filterable: false,
                renderCell: (params) => (
                    <div>
                        <IconButton
                            size="small"
                            onClick={() => {
                                setEditId(String(params.row.id));
                                setEditOpen(true);
                            }}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>

                        <IconButton
                            size="small"
                            color="error"
                            onClick={() => {
                                setDeleteId(String(params.row.id));
                                setConfirmOpen(true);
                            }}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </div>
                ),
            },
        ],
        []
    );

    const onSaveEdit = (data: ServiceLogFormData) => {
        if (!editId) return;
        dispatch(updateLog({ id: editId, data }));
        setEditOpen(false);
        setEditId(null);
    };

    const onConfirmDelete = () => {
        if (!deleteId) return;
        dispatch(deleteLog(deleteId));
        setConfirmOpen(false);
        setDeleteId(null);
    };

    return (
        <Paper variant="outlined" sx={{ p: 2, mt: 2, borderRadius: 3 }}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "center" }} justifyContent="space-between">
                <Box>
                    <Typography variant="h6" fontWeight={700}>
                        Service Logs
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Search + filter + edit/delete
                    </Typography>
                </Box>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                    <TextField
                        size="small"
                        label="Search"
                        value={filters.q}
                        onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
                    />

                    <FormControl size="small" sx={{ minWidth: 160 }}>
                        <InputLabel id="type-filter-label">Type</InputLabel>
                        <Select
                            labelId="type-filter-label"
                            label="Type"
                            value={filters.type}
                            onChange={(e) =>
                                setFilters((f) => ({ ...f, type: e.target.value as ServiceType | "all" }))
                            }
                        >
                            <MenuItem value="all">all</MenuItem>
                            <MenuItem value="planned">planned</MenuItem>
                            <MenuItem value="unplanned">unplanned</MenuItem>
                            <MenuItem value="emergency">emergency</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        size="small"
                        label="Start from"
                        type="date"
                        slotProps={{
                            inputLabel: { shrink: true },
                        }}
                        value={filters.startFrom}
                        onChange={(e) => setFilters((f) => ({ ...f, startFrom: e.target.value }))}
                    />
                    <TextField
                        size="small"
                        label="Start to"
                        type="date"
                        slotProps={{
                            inputLabel: { shrink: true },
                        }}
                        value={filters.startTo}
                        onChange={(e) => setFilters((f) => ({ ...f, startTo: e.target.value }))}
                    />

                    <Button variant="outlined" onClick={() => setFilters(DEFAULT_FILTERS)}>
                        Reset
                    </Button>
                </Stack>
            </Stack>

            <Box sx={{ height: 520, mt: 2 }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    disableRowSelectionOnClick
                    pageSizeOptions={[10, 25, 50]}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10, page: 0 } },
                    }}
                />
            </Box>

            <EditLogDialog
                open={editOpen}
                initial={editInitial}
                onClose={() => {
                    setEditOpen(false);
                    setEditId(null);
                }}
                onSave={onSaveEdit}
            />

            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle>Delete log?</DialogTitle>
                <DialogContent dividers>
                    This action cannot be undone.
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={() => setConfirmOpen(false)}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error" onClick={onConfirmDelete}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
}
