import { addDays, todayISO } from "./dateUtils";
import type { ServiceLogFormData } from "./types";

export function makeDefaultFormData(): ServiceLogFormData {
    const startDate = todayISO();
    const endDate = addDays(startDate, 1);

    return {
        providerId: "",
        serviceOrder: "",
        carId: "",
        odometerMi: null,
        engineHours: null,
        startDate,
        endDate,
        type: "planned",
        serviceDescription: "",
    };
}
