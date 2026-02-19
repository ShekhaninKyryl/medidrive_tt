import React from "react";
import {
    Box,
    Button,
    Divider,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
    Chip,
} from "@mui/material";
import { useForm, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import type { ServiceLogFormData } from "./types";
import { serviceLogSchema } from "./validation";
import { addDays } from "./dateUtils";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
    selectActiveDraft,
} from "./selectors";
import {
    createDraft,
    deleteDraft,
    clearAllDrafts,
    patchActiveDraftData,
    setActiveDraftStatus,
    setActiveDraftData,
} from "./draftSlice";
import { addLog } from "../service-logs/logsSlice";

function statusLabel(status: string) {
    switch (status) {
        case "saving":
            return "Saving...";
        case "saved":
            return "Draft saved";
        case "error":
            return "Save error";
        case "dirty":
        default:
            return "Unsaved changes";
    }
}

function statusColor(status: string): "default" | "success" | "warning" | "error" | "info" {
    switch (status) {
        case "saved":
            return "success";
        case "saving":
            return "info";
        case "error":
            return "error";
        case "dirty":
        default:
            return "warning";
    }
}

export function ServiceLogForm() {
    const dispatch = useAppDispatch();
    const activeDraft = useAppSelector(selectActiveDraft);

    const { control, handleSubmit, reset, setValue, getValues, formState } = useForm<ServiceLogFormData>({
        resolver: yupResolver(serviceLogSchema),
        mode: "onChange",
        defaultValues: activeDraft?.data,
    });

    const didMountRef = React.useRef(false);
    React.useEffect(() => {
        if (!activeDraft) return;
        reset(activeDraft.data);
        didMountRef.current = true;
    }, [activeDraft?.id, reset]);

    const startDate = useWatch({ control, name: "startDate" });
    React.useEffect(() => {
        if (!startDate) return;
        const computed = addDays(startDate, 1);
        const currentEnd = getValues("endDate");
        if (currentEnd !== computed) {
            setValue("endDate", computed, { shouldValidate: true, shouldDirty: true });
        }
    }, [startDate, getValues, setValue]);

    const values = useWatch({ control });

    const skipFirstAutosaveRef = React.useRef(true);
    const timerRef = React.useRef<number | null>(null);

    React.useEffect(() => {
        if (!activeDraft) return;

        if (!didMountRef.current) return;

        if (skipFirstAutosaveRef.current) {
            skipFirstAutosaveRef.current = false;
            return;
        }

        dispatch(patchActiveDraftData(values));

        if (timerRef.current) window.clearTimeout(timerRef.current);

        timerRef.current = window.setTimeout(() => {
            dispatch(setActiveDraftStatus("saving"));

            window.setTimeout(() => {
                dispatch(setActiveDraftStatus("saved"));
            }, 200);
        }, 500);

        return () => {
            if (timerRef.current) window.clearTimeout(timerRef.current);
        };
    }, [values, activeDraft?.id, dispatch]);

    const onCreateDraft = () => {
        dispatch(createDraft());
        skipFirstAutosaveRef.current = true;
    };

    const onDeleteDraft = () => {
        if (!activeDraft) return;
        dispatch(deleteDraft(activeDraft.id));
        skipFirstAutosaveRef.current = true;
    };

    const onClearAllDrafts = () => {
        dispatch(clearAllDrafts());
        skipFirstAutosaveRef.current = true;
    };

    const onSubmit = (data: ServiceLogFormData) => {
        const normalized: ServiceLogFormData = {
            ...data,
            endDate: addDays(data.startDate, 1),
        };

        dispatch(addLog(normalized));

        dispatch(setActiveDraftData(normalized));
        dispatch(setActiveDraftStatus("saved"));
    };

    if (!activeDraft) {
        return (
            <Box>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                    Service Log
                </Typography>
                <Typography sx={{ mb: 2 }} color="text.secondary">
                    Create a draft to start.
                </Typography>
                <Button variant="contained" onClick={onCreateDraft}>
                    Create Draft
                </Button>
            </Box>
        );
    }

    return (
        <Box>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                <Box>
                    <Typography variant="h6" fontWeight={700}>
                        Service Log Form
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Draft: {activeDraft.id}
                    </Typography>
                </Box>

                <Chip
                    label={statusLabel(activeDraft.status)}
                    color={statusColor(activeDraft.status)}
                    variant="outlined"
                />
            </Stack>

            <Stack spacing={2} component="form" onSubmit={handleSubmit(onSubmit)}>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                    <Controller
                        name="providerId"
                        control={control}
                        render={({ field, fieldState }) => (
                            <TextField
                                {...field}
                                label="Provider ID"
                                fullWidth
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                            />
                        )}
                    />
                    <Controller
                        name="serviceOrder"
                        control={control}
                        render={({ field, fieldState }) => (
                            <TextField
                                {...field}
                                label="Service Order"
                                fullWidth
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                            />
                        )}
                    />
                </Stack>

                <Controller
                    name="carId"
                    control={control}
                    render={({ field, fieldState }) => (
                        <TextField
                            {...field}
                            label="Car ID"
                            fullWidth
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                        />
                    )}
                />

                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                    <Controller
                        name="odometerMi"
                        control={control}
                        render={({ field, fieldState }) => (
                            <TextField
                                label="Odometer (mi)"
                                fullWidth
                                value={field.value ?? ""}
                                onChange={(e) => field.onChange(e.target.value === "" ? null : Number(e.target.value))}
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                                slotProps={{
                                    htmlInput: { inputMode: "numeric" }
                                }}
                            />
                        )}
                    />
                    <Controller
                        name="engineHours"
                        control={control}
                        render={({ field, fieldState }) => (
                            <TextField
                                label="Engine Hours"
                                fullWidth
                                value={field.value ?? ""}
                                onChange={(e) => field.onChange(e.target.value === "" ? null : Number(e.target.value))}
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                                slotProps={{
                                    htmlInput: { inputMode: "numeric" }
                                }}
                            />
                        )}
                    />
                </Stack>

                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                    <Controller
                        name="startDate"
                        control={control}
                        render={({ field, fieldState }) => (
                            <TextField
                                {...field}
                                label="Start Date"
                                type="date"
                                fullWidth
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                                slotProps={{
                                    inputLabel: { shrink: true }
                                }}
                            />
                        )}
                    />

                    <Controller
                        name="endDate"
                        control={control}
                        render={({ field, fieldState }) => (
                            <TextField
                                {...field}
                                label="End Date"
                                type="date"
                                fullWidth
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                                disabled
                                slotProps={{
                                    inputLabel: { shrink: true }
                                }}
                            />
                        )}
                    />
                </Stack>

                <Controller
                    name="type"
                    control={control}
                    render={({ field, fieldState }) => (
                        <FormControl fullWidth error={!!fieldState.error}>
                            <InputLabel id="type-label">Type</InputLabel>
                            <Select {...field} labelId="type-label" label="Type">
                                <MenuItem value="planned">planned</MenuItem>
                                <MenuItem value="unplanned">unplanned</MenuItem>
                                <MenuItem value="emergency">emergency</MenuItem>
                            </Select>
                            <FormHelperText>{fieldState.error?.message}</FormHelperText>
                        </FormControl>
                    )}
                />

                <Controller
                    name="serviceDescription"
                    control={control}
                    render={({ field, fieldState }) => (
                        <TextField
                            {...field}
                            label="Service Description"
                            fullWidth
                            multiline
                            minRows={3}
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                        />
                    )}
                />

                <Divider />

                <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between">
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                        <Button variant="contained" onClick={onCreateDraft}>
                            Create Draft
                        </Button>
                        <Button variant="outlined" color="error" onClick={onDeleteDraft}>
                            Delete Draft
                        </Button>
                        <Button variant="text" color="error" onClick={onClearAllDrafts}>
                            Clear All Drafts
                        </Button>
                    </Stack>

                    <Button
                        type="submit"
                        variant="contained"
                        disabled={!formState.isValid}
                    >
                        Create Service Log
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
}
