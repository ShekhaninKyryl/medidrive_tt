import * as yup from "yup";
import { addDays } from "./dateUtils";
import type { ServiceLogFormData, ServiceType } from "./types";

const SERVICE_TYPES: ServiceType[] = ["planned", "unplanned", "emergency"];

const numOrNull = () =>
    yup
        .number()
        .transform((value, originalValue) => {
            if (originalValue === "" || Number.isNaN(value)) return null;
            return value;
        })
        .nullable()
        .defined();

export const serviceLogSchema: yup.ObjectSchema<ServiceLogFormData> = yup.object({
    providerId: yup.string().trim().required("Provider ID is required").defined(),
    serviceOrder: yup.string().trim().required("Service order is required").defined(),
    carId: yup.string().trim().required("Car ID is required").defined(),

    odometerMi: numOrNull().min(0, "Odometer cannot be negative"),
    engineHours: numOrNull().min(0, "Engine hours cannot be negative"),

    startDate: yup.string().required("Start date is required").defined(),
    endDate: yup
        .string()
        .required("End date is required")
        .defined()
        .test("is-next-day", "End date must be start date + 1 day", function (value) {
            const startDate = this.parent.startDate;
            if (!startDate || !value) return true;
            return value === addDays(startDate, 1);
        }),

    type: yup.mixed<ServiceType>().oneOf(SERVICE_TYPES).required("Type is required").defined(),
    serviceDescription: yup.string().trim().required("Description is required").defined(),
});
