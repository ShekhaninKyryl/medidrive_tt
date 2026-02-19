import React from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
} from "@mui/material";
import { Controller, useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import type { ServiceLogFormData } from "../drafts/types";
import { serviceLogSchema } from "../drafts/validation";
import { addDays } from "../drafts/dateUtils";

type Props = {
    open: boolean;
    initial: ServiceLogFormData | null;
    onClose: () => void;
    onSave: (data: ServiceLogFormData) => void;
};

export function EditLogDialog({ open, initial, onClose, onSave }: Props) {
    const { control, handleSubmit, reset, setValue, getValues } = useForm<ServiceLogFormData>({
        resolver: yupResolver(serviceLogSchema),
        mode: "onChange",
        defaultValues: initial ?? undefined,
    });

    React.useEffect(() => {
        if (!initial) return;
        reset(initial);
    }, [initial, reset]);

    const startDate = useWatch({ control, name: "startDate" });
    React.useEffect(() => {
        if (!startDate) return;
        const computed = addDays(startDate, 1);
        const currentEnd = getValues("endDate");
        if (currentEnd !== computed) {
            setValue("endDate", computed, { shouldValidate: true, shouldDirty: true });
        }
    }, [startDate, getValues, setValue]);

    const submit = (data: ServiceLogFormData) => {
        onSave({ ...data, endDate: addDays(data.startDate, 1) });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Edit Service Log</DialogTitle>
            <DialogContent dividers>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                        <Controller
                            name="providerId"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField {...field} label="Provider ID" fullWidth error={!!fieldState.error} helperText={fieldState.error?.message} />
                            )}
                        />
                        <Controller
                            name="serviceOrder"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField {...field} label="Service Order" fullWidth error={!!fieldState.error} helperText={fieldState.error?.message} />
                            )}
                        />
                    </Stack>

                    <Controller
                        name="carId"
                        control={control}
                        render={({ field, fieldState }) => (
                            <TextField {...field} label="Car ID" fullWidth error={!!fieldState.error} helperText={fieldState.error?.message} />
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
                                    slotProps={{
                                        inputLabel: { shrink: true },
                                    }}
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message} />
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
                                    slotProps={{
                                        inputLabel: { shrink: true },
                                    }}
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                    disabled />
                            )}
                        />
                    </Stack>

                    <Controller
                        name="type"
                        control={control}
                        render={({ field, fieldState }) => (
                            <FormControl fullWidth error={!!fieldState.error}>
                                <InputLabel id="edit-type-label">Type</InputLabel>
                                <Select {...field} labelId="edit-type-label" label="Type">
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
                            <TextField {...field} label="Service Description" fullWidth multiline minRows={3} error={!!fieldState.error} helperText={fieldState.error?.message} />
                        )}
                    />
                </Stack>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} variant="outlined">Cancel</Button>
                <Button onClick={handleSubmit(submit)} variant="contained">Save</Button>
            </DialogActions>
        </Dialog>
    );
}
