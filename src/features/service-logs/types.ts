import type { ServiceLogFormData } from "../drafts/types";

export type ServiceLog = {
    id: string;
    data: ServiceLogFormData;
    createdAt: number;
    updatedAt: number;
};
