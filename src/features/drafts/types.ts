export type ServiceType = "planned" | "unplanned" | "emergency";

export type ServiceLogFormData = {
    providerId: string;
    serviceOrder: string;
    carId: string;
    odometerMi: number | null;
    engineHours: number | null;
    startDate: string;
    endDate: string;
    type: ServiceType;
    serviceDescription: string;
};

export type DraftSaveStatus = "dirty" | "saving" | "saved" | "error";

export type Draft = {
    id: string;
    data: ServiceLogFormData;
    status: DraftSaveStatus;
    createdAt: number;
    updatedAt: number;
};
